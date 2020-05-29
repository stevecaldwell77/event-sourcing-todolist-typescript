import { EventName } from 'src/lib/enums';
import {
    EventHandler,
    EventMapper,
    buildEntityFromEvents,
} from 'src/entities/entity-event';
import { TodoList, newList, getItem } from '../todo-list';
import { assertIsValidEventListCreated } from './events/list-created';
import { assertIsValidEventListItemCreated } from './events/list-item-created';
import { assertIsValidEventListItemCompleted } from './events/list-item-completed';
import { assertIsValidEventListItemUncompleted } from './events/list-item-uncompleted';
import { assertIsValidEventListItemMoved } from './events/list-item-moved';

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

export default buildEntityFromEvents(eventMapper);
