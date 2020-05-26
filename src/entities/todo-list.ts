import {
    EventListCreated,
    EventListItemCreated,
    EventListItemCompleted,
    EventListItemUncompleted,
    EventListItemMoved,
} from './todo-list/events';
import * as commands from './todo-list/commands';

interface Item {
    itemId: string;
    text: string;
    completed: boolean;
}

export interface TodoList {
    listId: string;
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

const applyEvent = (prev: TodoList | undefined, event: Event): TodoList => {
    if (event instanceof EventListCreated) return newList(event);
    if (!prev)
        throw new Error('cannot apply non-create event without previous list');
    if (event instanceof EventListItemCreated)
        return applyItemCreated(prev, event);
    if (event instanceof EventListItemCompleted)
        return applyItemCompleted(prev, event);
    if (event instanceof EventListItemUncompleted)
        return applyItemUncompleted(prev, event);
    if (event instanceof EventListItemMoved) return applyItemMoved(prev, event);
    throw new Error('Unknown event');
};

const getTodoList = (prev: TodoList | undefined, events: Event[]): TodoList => {
    const list = events.reduce(applyEvent, prev);
    if (!list) throw new Error('Unexpected error');
    return list;
};

export { getTodoList, commands };
