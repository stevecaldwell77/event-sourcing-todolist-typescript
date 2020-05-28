// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import getId from 'src/util/get-id';
import { makeTodoList, commands, getItem } from 'src/entities/todo-list';
import { User } from 'src/entities/user';
import { EntityEvent } from 'src/interfaces/entity-event';

const createTestUser = (): User => ({
    userId: getId(),
    email: 'jdoe@gmail.com',
    revision: 1,
    roles: [],
});

const runSetup = () => {
    const user = createTestUser();
    const listId = getId();
    const events: EntityEvent[] = commands.createList({
        agent: user,
        listId,
        owner: user.userId,
        title: 'My Test List',
    });
    const list = makeTodoList(undefined, events);
    return { events, user, listId, list };
};

const addItem = (
    events: EntityEvent[],
    user: User,
    itemText = `My Test Item ${getId()}`,
) => {
    const list = makeTodoList(undefined, events);
    const itemId = getId();
    events.push(
        ...commands.createListItem({
            agent: user,
            itemId,
            list,
            text: itemText,
        }),
    );
    return itemId;
};

test('createList()', (t) => {
    const { user, listId, list } = runSetup();
    t.deepEqual(
        list,
        {
            listId,
            owner: user.userId,
            revision: 1,
            items: [],
            title: 'My Test List',
        },
        'initialized list looks correct',
    );
});

test('createListItem()', (t) => {
    const setup = runSetup();
    const { user, events } = setup;
    let { list } = setup;

    const itemText = 'My Test Item';
    const itemId = addItem(events, user, itemText);

    list = makeTodoList(list, events);
    t.deepEqual(
        list.items,
        [
            {
                itemId,
                text: itemText,
                completed: false,
            },
        ],
        'item added to list',
    );
});

test('item completion', (t) => {
    const setup = runSetup();
    const { user, events } = setup;
    let { list } = setup;

    const itemId1 = addItem(events, user);
    const itemId2 = addItem(events, user);
    const itemId3 = addItem(events, user);

    list = makeTodoList(list, events);
    events.push(
        ...commands.completeListItem({
            agent: user,
            itemId: itemId2,
            list,
        }),
    );

    list = makeTodoList(list, events);
    events.push(
        ...commands.completeListItem({
            agent: user,
            itemId: itemId3,
            list,
        }),
    );

    list = makeTodoList(list, events);
    t.false(getItem(list, itemId1).completed, 'item1 not completed');
    t.true(getItem(list, itemId2).completed, 'item2 completed');
    t.true(getItem(list, itemId3).completed, 'item3 completed');

    events.push(
        ...commands.uncompleteListItem({
            agent: user,
            itemId: itemId2,
            list,
        }),
    );

    list = makeTodoList(list, events);
    t.false(getItem(list, itemId2).completed, 'item2 un-completed');
});
