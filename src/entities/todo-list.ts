import buildTodoList from './todo-list/build';
import * as commands from './todo-list/commands';

interface Item {
    itemId: string;
    text: string;
    completed: boolean;
}

export interface TodoList {
    listId: string;
    owner: string;
    revision: number;
    title: string;
    items: Item[];
}

export const getItem = (list: TodoList, itemId: string): Item => {
    const item = list.items.find((item) => item.itemId === itemId);
    if (!item)
        throw new Error(`list item ${list.listId}.${itemId} does not exist`);
    return item;
};

const newList = (params: {
    listId: string;
    owner: string;
    title: string;
}): TodoList => ({
    revision: 1,
    listId: params.listId,
    owner: params.owner,
    title: params.title,
    items: [],
});

export { buildTodoList, commands, newList };
