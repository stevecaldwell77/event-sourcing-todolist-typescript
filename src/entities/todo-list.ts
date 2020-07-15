import {
    StructType,
    object,
    number,
    string,
    array,
    boolean,
} from 'superstruct';
import { assertType } from 'src/util/types';

type TodoListItem = StructType<typeof TodoListItem>;
const TodoListItem = object({
    itemId: string(),
    text: string(),
    completed: boolean(),
});

export type TodoList = StructType<typeof TodoList>;
const TodoList = object({
    listId: string(),
    owner: string(),
    revision: number(),
    title: string(),
    items: array(TodoListItem),
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

export const assertTodoList = assertType(TodoList);
