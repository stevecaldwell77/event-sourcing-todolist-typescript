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

const createListItem: Command<TodoList, { itemId: string; text: string }> = {
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

const completeListItem: Command<TodoList, { itemId: string }> = {
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

const uncompleteListItem: Command<TodoList, { itemId: string }> = {
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

const moveListItem: Command<
    TodoList,
    { itemId: string; newPosition: number }
> = {
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
