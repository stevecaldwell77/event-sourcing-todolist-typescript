import { CreateCommand, Command } from 'src/entities/commands';
import { TodoList, getItem } from 'src/entities/todo-list';
import { makeEventListCreated } from './events/list-created';
import { makeEventListItemCreated } from './events/list-item-created';
import { makeEventListItemCompleted } from './events/list-item-completed';
import { makeEventListItemUncompleted } from './events/list-item-uncompleted';
import { makeEventListItemMoved } from './events/list-item-moved';

export interface CreateListParams {
    owner: string;
    title: string;
}

const createList: CreateCommand<TodoList, CreateListParams> = {
    name: 'createList',
    run: (entityId, agent, params) => [
        makeEventListCreated({
            agent,
            entityId,
            payload: { owner: params.owner, title: params.title },
            eventRevision: 1,
        }),
    ],
};

interface CreateListItemParams {
    itemId: string;
    text: string;
}

const createListItem: Command<TodoList, CreateListItemParams> = {
    name: 'createListItem',
    run: (list, agent, params) => {
        const { itemId } = params;
        const currentItemIds = list.items.map((i) => i.itemId);
        if (currentItemIds.includes(itemId))
            throw new Error(
                `list item ${list.listId}.${itemId} already exists`,
            );

        return [
            makeEventListItemCreated({
                agent,
                entityId: list.listId,
                eventRevision: list.revision + 1,
                payload: { itemId, text: params.text },
            }),
        ];
    },
};

interface CompleteListItemParams {
    itemId: string;
}

const completeListItem: Command<TodoList, CompleteListItemParams> = {
    name: 'completeListItem',
    run: (list, agent, params) => {
        const { itemId } = params;
        const item = getItem(list, itemId);
        if (item.completed)
            throw new Error(
                `list item ${list.listId}.${itemId} already completed`,
            );

        return [
            makeEventListItemCompleted({
                agent,
                entityId: list.listId,
                eventRevision: list.revision + 1,
                payload: { itemId },
            }),
        ];
    },
};

interface UncompleteListItemParams {
    itemId: string;
}

const uncompleteListItem: Command<TodoList, UncompleteListItemParams> = {
    name: 'uncompleteListItem',
    run: (list, agent, params) => {
        const { itemId } = params;
        const item = getItem(list, itemId);
        if (!item.completed)
            throw new Error(
                `list item ${list.listId}.${itemId} already completed`,
            );

        return [
            makeEventListItemUncompleted({
                agent,
                entityId: list.listId,
                eventRevision: list.revision + 1,
                payload: { itemId },
            }),
        ];
    },
};

interface MoveListItemParams {
    itemId: string;
    newPosition: number;
}

const moveListItem: Command<TodoList, MoveListItemParams> = {
    name: 'moveListItem',
    run: (list, agent, params) => {
        const { itemId, newPosition } = params;

        // asserts item existence
        getItem(list, itemId);

        const numItems = list.items.length;
        if (newPosition <= 0)
            throw new Error('newPosition must be greater than 0');
        if (newPosition > numItems)
            throw new Error('newPosition is out of bounds');

        return [
            makeEventListItemMoved({
                agent,
                entityId: list.listId,
                eventRevision: list.revision + 1,
                payload: { itemId, newPosition },
            }),
        ];
    },
};

export {
    createList,
    createListItem,
    completeListItem,
    uncompleteListItem,
    moveListItem,
};
