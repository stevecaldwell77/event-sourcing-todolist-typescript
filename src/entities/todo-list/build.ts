import { EntityEvent } from 'src/interfaces/entity-event';
import buildEntity from 'src/util/build-entity';
import { TodoList, newList, getItem } from '../todo-list';
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
} from './events';

const applyListCreated = (event: EventListCreated): TodoList =>
    newList({
        listId: event.entityId,
        owner: event.payload.owner,
        title: event.payload.title,
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
    console.log(`tbd: moving items not implemented (event ${event.eventId})`);
    return list;
};

const applyEvent = (
    prev: TodoList | undefined,
    event: EntityEvent,
): TodoList => {
    if (isEventListCreated(event)) return applyListCreated(event);
    if (!prev)
        throw new Error('cannot apply non-create event without previous list');
    if (isEventListItemCreated(event)) return applyItemCreated(prev, event);
    if (isEventListItemCompleted(event)) return applyItemCompleted(prev, event);
    if (isEventListItemUncompleted(event))
        return applyItemUncompleted(prev, event);
    if (isEventListItemMoved(event)) return applyItemMoved(prev, event);
    throw new Error(`Unknown event ${event.eventName}`);
};

export default (prev: TodoList | undefined, events: EntityEvent[]): TodoList =>
    buildEntity(prev, events, applyEvent);
