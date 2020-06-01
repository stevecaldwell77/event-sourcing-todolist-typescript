// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import getId from 'src/util/get-id';
import {
    TodoList,
    buildTodoList,
    commands,
    getItem,
} from 'src/entities/todo-list';
import { User, newUser } from 'src/entities/user';
import { EntityEvent } from 'src/entities/entity-event';
import getAdminUser from 'test/helpers/get-admin-user';

const runSetup = () => {
    const user = newUser({
        userId: getId(),
        email: 'jdoe@gmail.com',
    });
    const listId = getId();
    const events: EntityEvent[] = commands.createList({
        agent: user,
        listId,
        owner: user.userId,
        title: 'My Test List',
    });
    const list = buildTodoList(user, undefined, events);
    return { events, user, listId, list };
};

const addItem = (params: {
    user: User;
    list: TodoList;
    events: EntityEvent[];
    itemText?: string;
}) => {
    const itemId = getId();
    const { events, user, list } = params;
    const itemText = params.itemText || `My Test Item ${getId()}`;
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
    const { user } = setup;
    let { list } = setup;

    const events: EntityEvent[] = [];
    const itemText = 'My Test Item';
    const itemId = addItem({ events, list, user, itemText });

    list = buildTodoList(user, list, events);
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
    const { user } = setup;
    let { list } = setup;

    let events: EntityEvent[] = [];
    const itemId1 = addItem({ events, user, list });
    const itemId2 = addItem({ events, user, list });
    const itemId3 = addItem({ events, user, list });
    list = buildTodoList(user, list, events);

    events = [
        ...commands.completeListItem({
            agent: user,
            itemId: itemId2,
            list,
        }),
        ...commands.completeListItem({
            agent: user,
            itemId: itemId3,
            list,
        }),
    ];

    list = buildTodoList(user, list, events);
    t.false(getItem(list, itemId1).completed, 'item1 not completed');
    t.true(getItem(list, itemId2).completed, 'item2 completed');
    t.true(getItem(list, itemId3).completed, 'item3 completed');

    events = commands.uncompleteListItem({
        agent: user,
        itemId: itemId2,
        list,
    });

    list = buildTodoList(user, list, events);
    t.false(getItem(list, itemId2).completed, 'item2 un-completed');
});

test('permisssions: create list', (t) => {
    const { list } = runSetup();

    const otherUser = newUser({
        userId: getId(),
        email: 'other@example.com',
    });

    t.throws(
        () =>
            commands.createListItem({
                agent: otherUser,
                itemId: getId(),
                list,
                text: 'My Item',
            }),
        {
            message: 'LIST USER MISMATCH',
        },
        "a user is not allowed to create items on a different user's list",
    );
});

test('permisssions: read list', (t) => {
    const adminUser = getAdminUser();
    const otherUser = newUser({
        userId: getId(),
        email: 'other@example.com',
    });
    const { events, user } = runSetup();

    t.notThrows(() => {
        buildTodoList(user, undefined, events);
    }, 'a user can view their own list');

    t.notThrows(() => {
        buildTodoList(adminUser, undefined, events);
    }, 'an admin user can view a list');

    t.throws(
        () => {
            buildTodoList(otherUser, undefined, events);
        },
        {
            message: 'READ_LISTS NOT ALLOWED',
        },
        "a non-admin user cannot view another user's list",
    );
});
