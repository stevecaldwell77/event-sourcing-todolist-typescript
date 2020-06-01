import is from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import {
    EntityEvent,
    EventParams,
    makeEvent as makeBaseEvent,
} from 'src/entities/entity-event';
import { entityType } from 'src/entities/todo-list';

const eventName = EventName.LIST_ITEM_COMPLETED;

interface Payload {
    itemId: string;
}

interface EventListItemCompleted extends EntityEvent {
    readonly payload: Payload;
}

const makeEvent = (
    params: Omit<EventParams, 'entityType' | 'eventName'> & {
        payload: Payload;
    },
): EventListItemCompleted => ({
    ...makeBaseEvent({ ...params, entityType, eventName }),
    payload: params.payload,
});

const isEvent = (event: EntityEvent): event is EventListItemCompleted =>
    event.eventName === eventName;

function assertIsValidEvent(
    event: EntityEvent,
): asserts event is EventListItemCompleted {
    if (event.eventName !== eventName)
        throw new Error(`event does not have eventName of ${eventName}`);
    if (!is.plainObject((event as EventListItemCompleted).payload))
        throw new Error('event missing payload');
    if (!is.string((event as EventListItemCompleted).payload.itemId))
        throw new Error('event payload has invalid value for itemId');
}

export {
    // eslint-disable-next-line no-undef
    EventListItemCompleted,
    isEvent as isEventListItemCompleted,
    assertIsValidEvent as assertIsValidEventListItemCompleted,
    makeEvent as makeEventListItemCompleted,
};
