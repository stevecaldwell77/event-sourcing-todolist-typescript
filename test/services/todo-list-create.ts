import test from 'ava';
import { assert } from '@sindresorhus/is/dist';
import getId from 'src/util/get-id';
import { systemAgent } from 'src/entities/agent';
import { newUser } from 'src/entities/user';
import { EntityType } from 'src/lib/enums';
import { todoListService } from 'test/helpers/services';

test('TodoListService.create(): successful creation', async (t) => {
    const user = newUser({
        userId: getId(),
        email: 'jdoe@gmail.com',
    });

    const listId = getId();
    const getEvents = () =>
        todoListService.eventStore.getEvents(EntityType.TodoList, listId);

    t.deepEqual(await getEvents(), [], 'no events initially');

    await todoListService.create(listId, systemAgent, {
        owner: user.userId,
        title: 'my list',
    });

    const events = await getEvents();
    t.is(events.length, 1, 'one event saved');

    const list = await todoListService.get(listId, systemAgent);
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
        todoListService.create(listId, systemAgent, {
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
