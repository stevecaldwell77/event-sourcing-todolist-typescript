import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/entities/entity-event';
import buildEntity from 'src/util/build-entity';
import { TodoList, newList, getItem } from '../todo-list';
import {
    assertIsValidEventListCreated,
    assertIsValidEventListItemCompleted,
    assertIsValidEventListItemCreated,
    assertIsValidEventListItemMoved,
    assertIsValidEventListItemUncompleted,
} from './events';

type EventHandler<K> = (prev: K | undefined, event: EntityEvent) => K;
type EventMapper<K> = Partial<Record<EventName, EventHandler<K>>>;

const applyListCreated: EventHandler<TodoList> = (list, event) => {
    if (list) throw new Error('applyListCreated: list should not exist');
    assertIsValidEventListCreated(event);
    return newList({
        listId: event.entityId,
        owner: event.payload.owner,
        title: event.payload.title,
    });
};

const applyItemCreated: EventHandler<TodoList> = (list, event) => {
    if (!list) throw new Error('applyItemCreated: no list');
    assertIsValidEventListItemCreated(event);
    list.items.push({
        itemId: event.payload.itemId,
        text: event.payload.text,
        completed: false,
    });
    return list;
};

const applyItemCompleted: EventHandler<TodoList> = (list, event) => {
    if (!list) throw new Error('applyItemCompleted: no list');
    assertIsValidEventListItemCompleted(event);
    const item = getItem(list, event.payload.itemId);
    item.completed = true;
    return list;
};

const applyItemUncompleted: EventHandler<TodoList> = (list, event) => {
    if (!list) throw new Error('applyItemUncompleted: no list');
    assertIsValidEventListItemUncompleted(event);
    const item = getItem(list, event.payload.itemId);
    item.completed = false;
    return list;
};

const applyItemMoved: EventHandler<TodoList> = (list, event) => {
    if (!list) throw new Error('applyItemMoved: no list');
    assertIsValidEventListItemMoved(event);
    console.log(`tbd: moving items not implemented (event ${event.eventId})`);
    return list;
};

const eventMapper: EventMapper<TodoList> = {
    [EventName.LIST_CREATED]: applyListCreated,
    [EventName.LIST_ITEM_CREATED]: applyItemCreated,
    [EventName.LIST_ITEM_COMPLETED]: applyItemCompleted,
    [EventName.LIST_ITEM_UNCOMPLETED]: applyItemUncompleted,
    [EventName.LIST_ITEM_MOVED]: applyItemMoved,
};

const applyEvent = (
    prev: TodoList | undefined,
    event: EntityEvent,
): TodoList => {
    const handler = eventMapper[event.eventName];
    if (!handler) throw new Error(`Unknown event ${event.eventName}`);
    return handler(prev, event);
};

export default (prev: TodoList | undefined, events: EntityEvent[]): TodoList =>
    buildEntity(prev, events, applyEvent);
