import test from 'ava';
import getId from 'src/util/get-id';
import { systemAgent } from 'src/entities/agent';
import { newUser } from 'src/entities/user';
import { createTodoListItem } from 'src/entities/todo-list/commands';
import createTestTodoList from 'test/helpers/create-test-todo-list';
import { todoListService } from 'test/helpers/services';

const getList = async (listId: string) =>
    todoListService.getOrDie(listId, systemAgent);

test('TodoListService.createListItem() - success', async (t) => {
    const { user, listId } = await createTestTodoList();
    const itemId = getId();

    let list = await getList(listId);
    await todoListService.runCommand(createTodoListItem, list, user, {
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
    const { user, listId } = await createTestTodoList();
    const itemId = getId();

    const runCommand = async () => {
        const list = await getList(listId);
        await todoListService.runCommand(createTodoListItem, list, user, {
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
    const { listId } = await createTestTodoList();
    const list = await getList(listId);

    const otherUser = newUser({
        userId: getId(),
        email: 'other@example.com',
    });

    await t.throwsAsync(
        () =>
            todoListService.runCommand(createTodoListItem, list, otherUser, {
                itemId: getId(),
                text: 'My Test Item',
            }),
        {
            message: 'LIST USER MISMATCH',
        },
        "a user is not allowed to create items on a different user's list",
    );
});
