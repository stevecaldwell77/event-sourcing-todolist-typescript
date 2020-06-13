import test from 'ava';
import TodoListService from 'src/services/todo-list';
import EventStoreInMemory from 'src/event-store/in-memory';
import { systemAgent } from 'src/entities/agent';
import { newUser } from 'src/entities/user';
import { newList } from 'src/entities/todo-list';
import getId from 'src/util/get-id';
import getAdminUser from 'test/helpers/get-admin-user';

const eventStore = new EventStoreInMemory();
const todoListService = new TodoListService({ eventStore });

test('TodoListService.get(): success', async (t) => {
    const listId = getId();
    const user = newUser({
        userId: getId(),
        email: 'jdoe@gmail.com',
    });

    await todoListService.create(listId, systemAgent, {
        owner: user.userId,
        title: 'my test list',
    });

    const result = await todoListService.get(listId, systemAgent);

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

test('TodoListService.get(): miss', async (t) => {
    const listId = getId();
    const result = await todoListService.get(listId, systemAgent);
    t.is(result, undefined, 'undefined returned on unknown list');
});

test('get(): authorization', async (t) => {
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

    await todoListService.create(listId, user, {
        owner: user.userId,
        title: 'my test list',
    });

    await t.notThrowsAsync(
        () => todoListService.get(listId, user),
        'a user can view their own list',
    );

    await t.notThrowsAsync(
        () => todoListService.get(listId, adminUser),
        'an admin user can view a list',
    );

    await t.throwsAsync(
        () => todoListService.get(listId, otherUser),
        {
            message: 'NOT ALLOWED: READ_LIST',
        },
        "a non-admin user cannot read another user's list",
    );
});
