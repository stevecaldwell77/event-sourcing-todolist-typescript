import assert from 'assert';
import { Agent } from 'src/shared/agent';
import { TodoList, getItem } from '../todo-list';
import { User } from '../user';
import {
    makeEventListCreated,
    makeEventListItemCreated,
    makeEventListItemCompleted,
    makeEventListItemUncompleted,
    makeEventListItemMoved,
} from './events';

interface CommandParams {
    agent: Agent;
    list: TodoList;
}

const assertAgentPermissions = (agent: Agent, list: TodoList) => {
    const { owner } = list;
    const userIdMatches = (agent as User).userId === owner;
    assert(userIdMatches, 'LIST USER MISMATCH');
};

const eventBasics = (params: CommandParams) => ({
    agent: params.agent,
    eventRevision: params.list.revision + 1,
    listId: params.list.listId,
});

const createList = (params: {
    agent: Agent;
    owner: string;
    listId: string;
    title: string;
}) => [
    makeEventListCreated({
        ...params,
        eventRevision: 1,
    }),
];

const createListItem = (
    params: CommandParams & {
        itemId: string;
        text: string;
    },
) => {
    const { list, agent, itemId } = params;
    assertAgentPermissions(agent, list);

    const currentItemIds = list.items.map((i) => i.itemId);
    if (currentItemIds.includes(itemId))
        throw new Error(`list item ${list.listId}.${itemId} already exists`);

    return [
        makeEventListItemCreated({
            ...eventBasics(params),
            itemId,
            text: params.text,
        }),
    ];
};

const completeListItem = (
    params: CommandParams & {
        itemId: string;
    },
) => {
    const { list, agent, itemId } = params;
    assertAgentPermissions(agent, list);

    const item = getItem(list, itemId);
    if (item.completed)
        throw new Error(`list item ${list.listId}.${itemId} already completed`);

    return [
        makeEventListItemCompleted({
            ...eventBasics(params),
            itemId,
        }),
    ];
};

const uncompleteListItem = (
    params: CommandParams & {
        itemId: string;
    },
) => {
    const { list, agent, itemId } = params;
    assertAgentPermissions(agent, list);

    const item = getItem(list, itemId);
    if (!item.completed)
        throw new Error(`list item ${list.listId}.${itemId} not completed`);

    return [
        makeEventListItemUncompleted({
            ...eventBasics(params),
            itemId,
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
    assertAgentPermissions(agent, list);

    // asserts item existence
    getItem(list, itemId);
    const numItems = list.items.length;
    if (newPosition <= 0) throw new Error('newPosition must be greater than 0');
    if (newPosition > numItems) throw new Error('newPosition is out of bounds');

    return [
        makeEventListItemMoved({
            ...eventBasics(params),
            itemId,
            newPosition,
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
