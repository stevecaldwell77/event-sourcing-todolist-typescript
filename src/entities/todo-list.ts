import * as t from 'io-ts';
import { EntityType } from 'src/lib/enums';
import { assertSchema } from 'src/util/assert';
import buildEntity from './todo-list/build';
import * as commands from './todo-list/commands';
import authorization from './todo-list/authorization';

export const entityType = EntityType.TodoList;

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

const buildTodoList = buildEntity;

const assertValidTodoList = assertSchema(todoListSchema);

export { buildTodoList, commands, newList, assertValidTodoList, authorization };
