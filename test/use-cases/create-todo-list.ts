// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import EventStoreInMemory from 'src/event-store/in-memory';
import createTodoList from 'src/use-cases/create-todo-list';
import getId from 'src/util/get-id';
import { EntityType } from 'src/lib/enums';
import { isEventListCreated } from 'src/entities/todo-list/events/list-created';
import { newUser } from 'src/entities/user';

const eventStore = new EventStoreInMemory();

test('successful creation', async (t) => {
    const user = newUser({
        userId: getId(),
        email: 'jdoe@gmail.com',
    });

    const listId = getId();
    const getEvents = () => eventStore.getEvents(EntityType.TodoList, listId);

    t.deepEqual(await getEvents(), [], 'no events initially');

    await createTodoList({
        getTodoListSourceData: eventStore.getTodoListSourceData,
        saveEvents: eventStore.saveEvents,
        listId,
        user,
        title: 'my list',
    });

    const events = await getEvents();
    t.is(events.length, 1, 'one event saved');

    const event = events[0];
    if (isEventListCreated(event)) {
        t.pass('ListCreated event saved');
        t.is(event.payload.owner, user.userId, 'owner set correctly');
        t.is(event.payload.title, 'my list', 'title set correctly');
    } else {
        t.fail('unexpected event created');
    }
});

test('error on duplicate', async (t) => {
    const user = newUser({
        userId: getId(),
        email: 'jdoe@gmail.com',
    });

    const listId = getId();
    const createParams = {
        getTodoListSourceData: eventStore.getTodoListSourceData,
        saveEvents: eventStore.saveEvents,
        listId,
        user,
        title: 'my list',
    };

    await createTodoList(createParams);

    await t.throwsAsync(
        () => createTodoList(createParams),
        { message: /TodoList [a-z]+ already exists/ },
        'error thrown when trying to create duplicate list',
    );
});
