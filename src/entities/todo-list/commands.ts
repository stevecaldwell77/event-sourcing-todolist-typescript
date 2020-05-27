import { TodoList, getItem } from '../todo-list';
import {
    makeEventListCreated,
    makeEventListItemCreated,
    makeEventListItemCompleted,
    makeEventListItemUncompleted,
    makeEventListItemMoved,
} from './events';

const createList = (params: {
    userId: string;
    listRevision: number;
    listId: string;
    title: string;
}) =>
    makeEventListCreated({
        ...params,
        eventRevision: params.listRevision + 1,
    });

const createListItem = (params: {
    userId: string;
    listRevision: number;
    list: TodoList;
    itemId: string;
    text: string;
}) => {
    const { list, itemId } = params;
    const currentItemIds = list.items.map((i) => i.itemId);
    if (currentItemIds.includes(itemId))
        throw new Error(`list item ${list.listId}.${itemId} already exists`);

    return makeEventListItemCreated({
        userId: params.userId,
        eventRevision: params.listRevision + 1,
        listId: list.listId,
        itemId,
        text: params.text,
    });
};

const completeListItem = (params: {
    userId: string;
    listRevision: number;
    list: TodoList;
    itemId: string;
}) => {
    const { list, itemId } = params;
    const item = getItem(list, itemId);
    if (item.completed)
        throw new Error(`list item ${list.listId}.${itemId} already completed`);
    return makeEventListItemCompleted({
        userId: params.userId,
        eventRevision: params.listRevision + 1,
        listId: list.listId,
        itemId,
    });
};

const uncompleteListItem = (params: {
    userId: string;
    listRevision: number;
    list: TodoList;
    itemId: string;
}) => {
    const { list, itemId } = params;
    const item = getItem(list, itemId);
    if (!item.completed)
        throw new Error(`list item ${list.listId}.${itemId} not completed`);
    return makeEventListItemUncompleted({
        userId: params.userId,
        eventRevision: params.listRevision + 1,
        listId: list.listId,
        itemId,
    });
};

const moveListItem = (params: {
    userId: string;
    listRevision: number;
    list: TodoList;
    itemId: string;
    newPosition: number;
}) => {
    const { list, itemId, newPosition } = params;
    // asserts item existence
    getItem(list, itemId);
    const numItems = list.items.length;
    if (newPosition <= 0) throw new Error('newPosition must be greater than 0');
    if (newPosition > numItems) throw new Error('newPosition is out of bounds');
    return makeEventListItemMoved({
        userId: params.userId,
        eventRevision: params.listRevision + 1,
        listId: list.listId,
        itemId,
        newPosition,
    });
};

export {
    createList,
    createListItem,
    completeListItem,
    uncompleteListItem,
    moveListItem,
};
