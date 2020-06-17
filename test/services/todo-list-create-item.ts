import test from 'ava';
import EventStoreInMemory from 'src/event-store/event-store-in-memory';
import getId from 'src/util/get-id';
import { systemAgent } from 'src/entities/agent';
import { newUser } from 'src/entities/user';
import { createListItem } from 'src/entities/todo-list/commands';
import TodoListService from 'src/services/todo-list';
import createTestTodoList from 'test/helpers/create-test-todo-list';

const eventStore = new EventStoreInMemory();
const todoListSevice = new TodoListService({ eventStore });

const getList = async (listId: string) =>
    todoListSevice.getOrDie(listId, systemAgent);

test('TodoListService.createListItem() - success', async (t) => {
    const { user, listId } = await createTestTodoList(eventStore);
    const itemId = getId();

    let list = await getList(listId);
    await todoListSevice.runCommand(createListItem, list, user, {
        itemId,
        text: 'My Test Item',
    });

    list = await getList(listId);
    t.deepEqual(
        list.items,
        [
            {
                itemId,
                text: 'My Test Item',
                completed: false,
            },
        ],
        'item added to list',
    );
});

test('TodoListService.createListItem() - duplicate throws error', async (t) => {
    const { user, listId } = await createTestTodoList(eventStore);
    const itemId = getId();

    const runCommand = async () => {
        const list = await getList(listId);
        await todoListSevice.runCommand(createListItem, list, user, {
            itemId,
            text: 'My Test Item',
        });
    };

    await runCommand();

    await t.throwsAsync(
        runCommand,
        {
            message: `list item ${listId}.${itemId} already exists`,
        },
        'error thrown trying to save duplicate item',
    );
});

test('TodoListService.createListItem() - permissions', async (t) => {
    const { listId } = await createTestTodoList(eventStore);
    const list = await getList(listId);

    const otherUser = newUser({
        userId: getId(),
        email: 'other@example.com',
    });

    await t.throwsAsync(
        () =>
            todoListSevice.runCommand(createListItem, list, otherUser, {
                itemId: getId(),
                text: 'My Test Item',
            }),
        {
            message: 'LIST USER MISMATCH',
        },
        "a user is not allowed to create items on a different user's list",
    );
});
