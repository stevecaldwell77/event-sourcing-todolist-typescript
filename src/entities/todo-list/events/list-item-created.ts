import is from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import {
    EntityEvent,
    EventParams,
    makeEvent as makeBaseEvent,
} from 'src/entities/entity-event';
import { entityType } from 'src/entities/todo-list';

const eventName = EventName.LIST_ITEM_CREATED;

interface Payload {
    itemId: string;
    text: string;
}

interface EventListItemCreated extends EntityEvent {
    readonly payload: Payload;
}

const makeEvent = (
    params: Omit<EventParams, 'entityType' | 'eventName'> & {
        payload: Payload;
    },
): EventListItemCreated => ({
    ...makeBaseEvent({ ...params, entityType, eventName }),
    payload: params.payload,
});

const isEvent = (event: EntityEvent): event is EventListItemCreated =>
    event.eventName === eventName;

function assertIsValidEvent(
    event: EntityEvent,
): asserts event is EventListItemCreated {
    if (event.eventName !== eventName)
        throw new Error(`event does not have eventName of ${eventName}`);
    if (!is.plainObject((event as EventListItemCreated).payload))
        throw new Error('event missing payload');
    if (!is.string((event as EventListItemCreated).payload.itemId))
        throw new Error('event payload has invalid value for itemId');
    if (!is.string((event as EventListItemCreated).payload.text))
        throw new Error('event payload has invalid value for text');
}

export {
    // eslint-disable-next-line no-undef
    EventListItemCreated,
    isEvent as isEventListItemCreated,
    assertIsValidEvent as assertIsValidEventListItemCreated,
    makeEvent as makeEventListItemCreated,
};
