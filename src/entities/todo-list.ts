import * as t from 'io-ts';
import { EntityType } from 'src/lib/enums';
import { assertSchema } from 'src/util/assert';
import { Permission, agentHasPermission } from 'src/entities/authorization';
import { Agent, getUserId } from 'src/entities/agent';
import buildEntity from './todo-list/build';
import * as commands from './todo-list/commands';

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

const assertReadAuthorized = (agent: Agent, list: TodoList): void => {
    if (getUserId(agent) === list.owner) return;
    if (agentHasPermission(agent, Permission.LIST_READ_ALL)) return;
    throw new Error('NOT ALLOWED: READ_LIST');
};

const buildTodoList = buildEntity;

const assertValidTodoList = assertSchema(todoListSchema);

export {
    buildTodoList,
    commands,
    newList,
    assertValidTodoList,
    assertReadAuthorized,
};
