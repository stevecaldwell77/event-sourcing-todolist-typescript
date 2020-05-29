import { Agent } from 'src/shared/agent';
import { EntityType, EventName } from 'src/lib/enums';
import { EntityEvent, makeEvent } from 'src/entities/entity-event';
import {
    EventListCreated,
    isEventListCreated,
    assertIsValidEventListCreated,
    makeEventListCreated,
} from './events/list-created';
import {
    EventListItemCreated,
    isEventListItemCreated,
    assertIsValidEventListItemCreated,
    makeEventListItemCreated,
} from './events/list-item-created';
import {
    EventListItemCompleted,
    isEventListItemCompleted,
    assertIsValidEventListItemCompleted,
    makeEventListItemCompleted,
} from './events/list-item-completed';
import {
    EventListItemUncompleted,
    isEventListItemUncompleted,
    assertIsValidEventListItemUncompleted,
    makeEventListItemUncompleted,
} from './events/list-item-uncompleted';
import {
    EventListItemMoved,
    isEventListItemMoved,
    assertIsValidEventListItemMoved,
    makeEventListItemMoved,
} from './events/list-item-moved';

export interface TodoListEventParams {
    eventId?: string;
    eventTimestamp?: number;
    eventRevision: number;
    listId: string;
    agent: Agent;
}

export const makeTodoListEvent = (
    params: TodoListEventParams,
    eventName: EventName,
): EntityEvent =>
    makeEvent({
        ...params,
        entity: EntityType.TodoList,
        entityId: params.listId,
        eventName,
    });

export {
    assertIsValidEventListCreated,
    assertIsValidEventListItemCompleted,
    assertIsValidEventListItemCreated,
    assertIsValidEventListItemMoved,
    assertIsValidEventListItemUncompleted,
    EventListCreated,
    EventListItemCompleted,
    EventListItemCreated,
    EventListItemMoved,
    EventListItemUncompleted,
    isEventListCreated,
    isEventListItemCompleted,
    isEventListItemCreated,
    isEventListItemMoved,
    isEventListItemUncompleted,
    makeEventListCreated,
    makeEventListItemCompleted,
    makeEventListItemCreated,
    makeEventListItemMoved,
    makeEventListItemUncompleted,
};
