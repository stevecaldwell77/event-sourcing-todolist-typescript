import is from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import {
    EntityEvent,
    EventParams,
    makeEvent as makeBaseEvent,
} from 'src/entities/entity-event';
import { entityType } from 'src/entities/todo-list';

const eventName = EventName.LIST_ITEM_MOVED;

interface Payload {
    itemId: string;
    newPosition: number;
}

interface EventListItemMoved extends EntityEvent {
    readonly payload: Payload;
}

const makeEvent = (
    params: Omit<EventParams, 'entityType' | 'eventName'> & {
        payload: Payload;
    },
): EventListItemMoved => ({
    ...makeBaseEvent({ ...params, entityType, eventName }),
    payload: params.payload,
});

const isEvent = (event: EntityEvent): event is EventListItemMoved =>
    event.eventName === eventName;

function assertIsValidEvent(
    event: EntityEvent,
): asserts event is EventListItemMoved {
    if (event.eventName !== eventName)
        throw new Error(`event does not have eventName of ${eventName}`);
    if (!is.plainObject((event as EventListItemMoved).payload))
        throw new Error('event missing payload');
    if (!is.string((event as EventListItemMoved).payload.itemId))
        throw new Error('event payload has invalid value for itemId');
    if (!is.string((event as EventListItemMoved).payload.newPosition))
        throw new Error('event payload has invalid value for newPosition');
}

export {
    // eslint-disable-next-line no-undef
    EventListItemMoved,
    isEvent as isEventListItemMoved,
    assertIsValidEvent as assertIsValidEventListItemMoved,
    makeEvent as makeEventListItemMoved,
};
