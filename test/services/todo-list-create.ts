import test from 'ava';
import { assert } from '@sindresorhus/is/dist';
import EventStoreInMemory from 'src/event-store/in-memory';
import getId from 'src/util/get-id';
import { systemAgent } from 'src/entities/agent';
import { newUser } from 'src/entities/user';
import { EntityType } from 'src/lib/enums';
import TodoListService from 'src/services/todo-list';

const eventStore = new EventStoreInMemory();
const todoListSevice = new TodoListService({ eventStore });

test('TodoListService.create(): successful creation', async (t) => {
    const user = newUser({
        userId: getId(),
        email: 'jdoe@gmail.com',
    });

    const listId = getId();
    const getEvents = () => eventStore.getEvents(EntityType.TodoList, listId);

    t.deepEqual(await getEvents(), [], 'no events initially');

    await todoListSevice.create(listId, systemAgent, {
        owner: user.userId,
        title: 'my list',
    });

    const events = await getEvents();
    t.is(events.length, 1, 'one event saved');

    const list = await todoListSevice.get(listId, systemAgent);
    t.truthy(list, 'list can be fetched aftewards');
    assert.object(list);
    t.deepEqual(
        list,
        {
            listId,
            revision: 1,
            owner: user.userId,
            title: 'my list',
            items: [],
        },
        'inital list created correctly',
    );
});

test('TodoListService.create():  error on duplicate', async (t) => {
    const listId = getId();

    const runCommand = () =>
        todoListSevice.create(listId, systemAgent, {
            owner: getId(),
            title: 'a list',
        });

    await runCommand();

    await t.throwsAsync(
        () => runCommand(),
        {
            message: `TodoListService.create(): ${listId} already exists`,
        },
        'error thrown when trying to create duplicate list',
    );
});
