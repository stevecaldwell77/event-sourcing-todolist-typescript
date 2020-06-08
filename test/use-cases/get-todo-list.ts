// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import getId from 'src/util/get-id';
import EventStoreInMemory from 'src/event-store/in-memory';
import createTodoList from 'src/use-cases/create-todo-list';
import getTodoList from 'src/use-cases/get-todo-list';
import { newUser } from 'src/entities/user';
import { newList } from 'src/entities/todo-list';
import getAdminUser from 'test/helpers/get-admin-user';

const eventStore = new EventStoreInMemory();

test('successful fetch', async (t) => {
    const listId = getId();
    const user = newUser({
        userId: getId(),
        email: 'jdoe@gmail.com',
    });

    await createTodoList({
        getTodoListSourceData: eventStore.getTodoListSourceData,
        saveEvents: eventStore.saveEvents,
        listId,
        title: 'my test list',
        user,
    });

    const result = await getTodoList({
        getTodoListSourceData: eventStore.getTodoListSourceData,
        agent: user,
        listId,
    });

    t.deepEqual(
        result,
        newList({
            listId,
            owner: user.userId,
            title: 'my test list',
        }),
        'list fetched correctly',
    );
});

test('miss', async (t) => {
    const listId = getId();
    const user = newUser({
        userId: getId(),
        email: 'jdoe@gmail.com',
    });

    const result = await getTodoList({
        getTodoListSourceData: eventStore.getTodoListSourceData,
        agent: user,
        listId,
    });

    t.is(result, undefined, 'undefined returned on unknown list');
});

test('authorization', async (t) => {
    const listId = getId();

    const adminUser = getAdminUser();
    const user = newUser({
        userId: getId(),
        email: 'listuser@example.com',
    });
    const otherUser = newUser({
        userId: getId(),
        email: 'other@example.com',
    });

    await createTodoList({
        getTodoListSourceData: eventStore.getTodoListSourceData,
        saveEvents: eventStore.saveEvents,
        listId,
        title: 'my test list',
        user,
    });

    await t.notThrowsAsync(
        () =>
            getTodoList({
                getTodoListSourceData: eventStore.getTodoListSourceData,
                agent: user,
                listId,
            }),
        'a user can view their own list',
    );

    await t.notThrowsAsync(
        () =>
            getTodoList({
                getTodoListSourceData: eventStore.getTodoListSourceData,
                agent: adminUser,
                listId,
            }),
        'an admin user can view a list',
    );

    await t.throwsAsync(
        () =>
            getTodoList({
                getTodoListSourceData: eventStore.getTodoListSourceData,
                agent: otherUser,
                listId,
            }),
        {
            message: 'NOT ALLOWED: READ_LIST',
        },
        "a non-admin user cannot view another user's list",
    );
});
