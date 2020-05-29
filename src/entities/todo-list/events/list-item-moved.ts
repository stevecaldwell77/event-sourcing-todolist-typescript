import is from '@sindresorhus/is';
import { EntityType, EventName } from 'src/lib/enums';
import {
    EntityEvent,
    EventParams,
    makeEvent as makeBaseEvent,
} from 'src/entities/entity-event';

const entityType = EntityType.TodoList;
const eventName = EventName.LIST_ITEM_MOVED;

interface Payload {
    itemId: string;
    newPosition: number;
}

interface Event extends EntityEvent {
    readonly payload: Payload;
}

const makeEvent = (
    params: Omit<EventParams, 'entityType' | 'eventName'> & {
        payload: Payload;
    },
): Event => ({
    ...makeBaseEvent({ ...params, entityType, eventName }),
    payload: params.payload,
});

const isEvent = (event: EntityEvent): event is Event =>
    event.eventName === eventName;

function assertIsValidEvent(event: EntityEvent): asserts event is Event {
    if (event.eventName !== eventName)
        throw new Error(`event does not have eventName of ${eventName}`);
    if (!is.plainObject((event as Event).payload))
        throw new Error('event missing payload');
    if (!is.string((event as Event).payload.itemId))
        throw new Error('event payload has invalid value for itemId');
    if (!is.string((event as Event).payload.newPosition))
        throw new Error('event payload has invalid value for newPosition');
}

export {
    // eslint-disable-next-line no-undef
    Event as EventListItemMoved,
    isEvent as isEventListItemMoved,
    assertIsValidEvent as assertIsValidEventListItemMoved,
    makeEvent as makeEventListItemMoved,
};
