import test from 'ava';
import getId from 'src/util/get-id';
import { systemAgent } from 'src/entities/system-agent';
import { User } from 'src/entities/user';
import { TodoList, getItem } from 'src/entities/todo-list';
import {
    createTodoListItem,
    completeTodoListItem,
    uncompleteTodoListItem,
} from 'src/entities/todo-list/commands';
import createTestTodoList from 'test/helpers/create-test-todo-list';
import { todoListService } from 'test/helpers/services';

const getList = async (listId: string) =>
    todoListService.getOrDie(listId, systemAgent);

const addItem = async (user: User, list: TodoList, itemText: string) => {
    const itemId = getId();
    await todoListService.runCommand(createTodoListItem, list, user, {
        itemId,
        text: itemText,
    });
    return itemId;
};

test('TodoListService: item completion', async (t) => {
    const { user, listId } = await createTestTodoList();
    let list = await getList(listId);

    const itemId1 = await addItem(user, list, 'first item');
    const itemId2 = await addItem(user, list, 'second item');
    const itemId3 = await addItem(user, list, 'third item');

    await todoListService.runCommand(completeTodoListItem, list, user, {
        itemId: itemId2,
    });

    await todoListService.runCommand(completeTodoListItem, list, user, {
        itemId: itemId3,
    });

    list = await getList(listId);
    t.false(getItem(list, itemId1).completed, 'item1 not completed');
    t.true(getItem(list, itemId2).completed, 'item2 completed');
    t.true(getItem(list, itemId3).completed, 'item3 completed');

    await todoListService.runCommand(uncompleteTodoListItem, list, user, {
        itemId: itemId2,
    });
    list = await getList(listId);
    t.false(getItem(list, itemId2).completed, 'item2 un-completed');
});
