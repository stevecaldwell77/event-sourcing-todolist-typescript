import { Agent } from 'src/entities/agent';
import { TodoList, getItem } from '../todo-list';
import authorization from './authorization';
import { makeEventListCreated } from './events/list-created';
import { makeEventListItemCreated } from './events/list-item-created';
import { makeEventListItemCompleted } from './events/list-item-completed';
import { makeEventListItemUncompleted } from './events/list-item-uncompleted';
import { makeEventListItemMoved } from './events/list-item-moved';

interface CommandParams {
    agent: Agent;
    list: TodoList;
}

const eventBasics = (params: CommandParams) => ({
    agent: params.agent,
    eventRevision: params.list.revision + 1,
    entityId: params.list.listId,
});

const createList = (params: {
    agent: Agent;
    owner: string;
    listId: string;
    title: string;
}) => {
    authorization.assertCommand(params.agent, 'createList');
    return [
        makeEventListCreated({
            agent: params.agent,
            entityId: params.listId,
            payload: { owner: params.owner, title: params.title },
            eventRevision: 1,
        }),
    ];
};

const createListItem = (
    params: CommandParams & {
        itemId: string;
        text: string;
    },
) => {
    const { list, agent, itemId } = params;
    authorization.assertCommand(agent, 'createListItem', list);

    const currentItemIds = list.items.map((i) => i.itemId);
    if (currentItemIds.includes(itemId))
        throw new Error(`list item ${list.listId}.${itemId} already exists`);

    return [
        makeEventListItemCreated({
            ...eventBasics(params),
            payload: {
                itemId,
                text: params.text,
            },
        }),
    ];
};

const completeListItem = (
    params: CommandParams & {
        itemId: string;
    },
) => {
    const { list, agent, itemId } = params;
    authorization.assertCommand(agent, 'completeListItem', list);

    const item = getItem(list, itemId);
    if (item.completed)
        throw new Error(`list item ${list.listId}.${itemId} already completed`);

    return [
        makeEventListItemCompleted({
            ...eventBasics(params),
            payload: { itemId },
        }),
    ];
};

const uncompleteListItem = (
    params: CommandParams & {
        itemId: string;
    },
) => {
    const { list, agent, itemId } = params;
    authorization.assertCommand(agent, 'uncompleteListItem', list);

    const item = getItem(list, itemId);
    if (!item.completed)
        throw new Error(`list item ${list.listId}.${itemId} not completed`);

    return [
        makeEventListItemUncompleted({
            ...eventBasics(params),
            payload: { itemId },
        }),
    ];
};

const moveListItem = (
    params: CommandParams & {
        itemId: string;
        newPosition: number;
    },
) => {
    const { list, agent, itemId, newPosition } = params;
    authorization.assertCommand(agent, 'moveListItem', list);

    // asserts item existence
    getItem(list, itemId);
    const numItems = list.items.length;
    if (newPosition <= 0) throw new Error('newPosition must be greater than 0');
    if (newPosition > numItems) throw new Error('newPosition is out of bounds');

    return [
        makeEventListItemMoved({
            ...eventBasics(params),
            payload: {
                itemId,
                newPosition,
            },
        }),
    ];
};

export {
    createList,
    createListItem,
    completeListItem,
    uncompleteListItem,
    moveListItem,
};
