import test from 'ava';
import EventStoreInMemory from 'src/event-management/event-store-in-memory';
import getId from 'src/util/get-id';
import { systemAgent } from 'src/entities/agent';
import { User } from 'src/entities/user';
import { TodoList, getItem } from 'src/entities/todo-list';
import {
    createListItem,
    completeListItem,
    uncompleteListItem,
} from 'src/entities/todo-list/commands';
import TodoListService from 'src/services/todo-list';
import createTestTodoList from 'test/helpers/create-test-todo-list';

const eventStore = new EventStoreInMemory();
const todoListSevice = new TodoListService({ eventStore });

const getList = async (listId: string) =>
    todoListSevice.getOrDie(listId, systemAgent);

const addItem = async (user: User, list: TodoList, itemText: string) => {
    const itemId = getId();
    await todoListSevice.runCommand(createListItem, list, user, {
        itemId,
        text: itemText,
    });
    return itemId;
};

test('TodoListService: item completion', async (t) => {
    const { user, listId } = await createTestTodoList(eventStore);
    let list = await getList(listId);

    const itemId1 = await addItem(user, list, 'first item');
    const itemId2 = await addItem(user, list, 'second item');
    const itemId3 = await addItem(user, list, 'third item');

    await todoListSevice.runCommand(completeListItem, list, user, {
        itemId: itemId2,
    });

    await todoListSevice.runCommand(completeListItem, list, user, {
        itemId: itemId3,
    });

    list = await getList(listId);
    t.false(getItem(list, itemId1).completed, 'item1 not completed');
    t.true(getItem(list, itemId2).completed, 'item2 completed');
    t.true(getItem(list, itemId3).completed, 'item3 completed');

    await todoListSevice.runCommand(uncompleteListItem, list, user, {
        itemId: itemId2,
    });
    list = await getList(listId);
    t.false(getItem(list, itemId2).completed, 'item2 un-completed');
});
