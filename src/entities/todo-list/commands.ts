import { CreateCommand, Command } from 'src/event-management/command';
import { TodoListEvent } from 'src/events/todo-list-events';
import { Agent } from 'src/entities/agent';
import { TodoList, getItem } from 'src/entities/todo-list';
import {
    generateEventTodoListCreated,
    generateEventTodoListItemCreated,
    generateEventTodoListItemCompleted,
    generateEventTodoListItemUncompleted,
    generateEventTodoListItemMoved,
} from 'src/entities/todo-list/event-generators';

export type CreateTodoListParams = {
    owner: string;
    title: string;
};
export const createTodoList: CreateCommand<
    TodoListEvent,
    Agent,
    CreateTodoListParams
> = {
    name: 'createTodoList',
    run: (listId, agent, payload: CreateTodoListParams) => [
        generateEventTodoListCreated(agent, listId, payload),
    ],
};

type CreateTodoListItemParams = { itemId: string; text: string };
export const createTodoListItem: Command<
    TodoListEvent,
    Agent,
    TodoList,
    CreateTodoListItemParams
> = {
    name: 'createTodoListItem',
    run: (list, agent, payload: CreateTodoListItemParams) => {
        const { itemId } = payload;
        const currentItemIds = list.items.map((i) => i.itemId);
        if (currentItemIds.includes(itemId))
            throw new Error(
                `list item ${list.listId}.${itemId} already exists`,
            );
        return [generateEventTodoListItemCreated(agent, list, payload)];
    },
};

type CompleteTodoListItemParams = { itemId: string };
export const completeTodoListItem: Command<
    TodoListEvent,
    Agent,
    TodoList,
    CompleteTodoListItemParams
> = {
    name: 'completeTodoListItem',
    run: (list, agent, payload: CompleteTodoListItemParams) => {
        const { itemId } = payload;
        const item = getItem(list, itemId);
        if (item.completed)
            throw new Error(
                `list item ${list.listId}.${itemId} already completed`,
            );
        return [generateEventTodoListItemCompleted(agent, list, payload)];
    },
};

type UncompleteTodoListItemParams = { itemId: string };
export const uncompleteTodoListItem: Command<
    TodoListEvent,
    Agent,
    TodoList,
    UncompleteTodoListItemParams
> = {
    name: 'uncompleteTodoListItem',
    run: (list, agent, payload: UncompleteTodoListItemParams) => {
        const { itemId } = payload;
        const item = getItem(list, itemId);
        if (!item.completed)
            throw new Error(
                `list item ${list.listId}.${itemId} already completed`,
            );
        return [generateEventTodoListItemUncompleted(agent, list, payload)];
    },
};

type MoveTodoListItemParams = { itemId: string; newPosition: number };
export const moveTodoListItem: Command<
    TodoListEvent,
    Agent,
    TodoList,
    MoveTodoListItemParams
> = {
    name: 'moveTodoListItem',
    run: (list, agent, payload: MoveTodoListItemParams) => {
        const { itemId, newPosition } = payload;

        // asserts item existence
        getItem(list, itemId);

        const numItems = list.items.length;
        if (newPosition <= 0)
            throw new Error('newPosition must be greater than 0');
        if (newPosition > numItems)
            throw new Error('newPosition is out of bounds');

        return [generateEventTodoListItemMoved(agent, list, payload)];
    },
};
