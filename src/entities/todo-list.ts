import { EntityType } from 'src/lib/enums';
import {
    Permission,
    assertAgentHasPermission,
} from 'src/entities/authorization';
import { Agent, getUserId } from 'src/entities/agent';
import { EntityEvent } from 'src/entities/entity-event';
import buildEntity from './todo-list/build';
import * as commands from './todo-list/commands';

export const entityType = EntityType.TodoList;

interface TodoListItem {
    itemId: string;
    text: string;
    completed: boolean;
}

export interface TodoList {
    listId: string;
    owner: string;
    revision: number;
    title: string;
    items: TodoListItem[];
}

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

const assertAuthorized = (agent: Agent, list: TodoList): void => {
    if (getUserId(agent) === list.owner) return;
    assertAgentHasPermission(agent, Permission.READ_LISTS);
};

const buildTodoList = (
    agent: Agent,
    prev: TodoList | undefined,
    events: EntityEvent[],
) => {
    const user = buildEntity(prev, events);
    assertAuthorized(agent, user);
    return user;
};

export { buildTodoList, commands, newList };
