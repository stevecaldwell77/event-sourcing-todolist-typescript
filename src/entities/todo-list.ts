import * as t from 'io-ts';
import { mapOrDie } from 'src/util/io-ts';

export type TodoList = t.TypeOf<typeof todoListSchema>;

type TodoListItem = t.TypeOf<typeof itemSchema>;

const itemSchema = t.type({
    itemId: t.string,
    text: t.string,
    completed: t.boolean,
});

const todoListSchema = t.type({
    listId: t.string,
    owner: t.string,
    revision: t.number,
    title: t.string,
    items: t.array(itemSchema),
});

export const getItem = (list: TodoList, itemId: string): TodoListItem => {
    const item = list.items.find((item) => item.itemId === itemId);
    if (!item)
        throw new Error(`list item ${list.listId}.${itemId} does not exist`);
    return item;
};

export const newList = (params: {
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

export const mapToTodoList = mapOrDie(todoListSchema);
