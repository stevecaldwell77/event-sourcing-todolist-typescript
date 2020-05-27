import { EntityEvent } from './event';
import {
    EventListCreated,
    EventListItemCreated,
    EventListItemCompleted,
    EventListItemUncompleted,
    EventListItemMoved,
    isEventListCreated,
    isEventListItemCreated,
    isEventListItemCompleted,
    isEventListItemUncompleted,
    isEventListItemMoved,
} from './todo-list/events';
import * as commands from './todo-list/commands';

interface Item {
    itemId: string;
    text: string;
    completed: boolean;
}

export interface TodoList {
    listId: string;
    revision: number;
    title: string;
    items: Item[];
}

export const getItem = (list: TodoList, itemId: string): Item => {
    const item = list.items.find((item) => item.itemId === itemId);
    if (!item)
        throw new Error(`list item ${list.listId}.${itemId} does not exist`);
    return item;
};

const newList = (event: EventListCreated): TodoList => ({
    revision: 1,
    listId: event.entityId,
    title: event.payload.title,
    items: [],
});

const applyItemCreated = (
    list: TodoList,
    event: EventListItemCreated,
): TodoList => {
    list.items.push({
        itemId: event.payload.itemId,
        text: event.payload.text,
        completed: false,
    });
    return list;
};

const applyItemCompleted = (
    list: TodoList,
    event: EventListItemCompleted,
): TodoList => {
    const item = getItem(list, event.payload.itemId);
    item.completed = true;
    return list;
};

const applyItemUncompleted = (
    list: TodoList,
    event: EventListItemUncompleted,
): TodoList => {
    const item = getItem(list, event.payload.itemId);
    item.completed = false;
    return list;
};

const applyItemMoved = (
    list: TodoList,
    event: EventListItemMoved,
): TodoList => {
    console.log('tbd: moving items not implemented');
    return list;
};

const applyEvent = (
    prev: TodoList | undefined,
    event: EntityEvent,
): TodoList => {
    if (isEventListCreated(event)) return newList(event);
    if (!prev)
        throw new Error('cannot apply non-create event without previous list');
    if (isEventListItemCreated(event)) return applyItemCreated(prev, event);
    if (isEventListItemCompleted(event)) return applyItemCompleted(prev, event);
    if (isEventListItemUncompleted(event))
        return applyItemUncompleted(prev, event);
    if (isEventListItemMoved(event)) return applyItemMoved(prev, event);
    throw new Error('Unknown event');
};

const makeTodoList = (
    prev: TodoList | undefined,
    events: EntityEvent[],
): TodoList => {
    const list = events.reduce(applyEvent, prev);
    if (!list) throw new Error('Unexpected error');
    const lastEvent = events[events.length - 1];
    list.revision = lastEvent.eventRevision;
    return list;
};

export { makeTodoList, commands };
