import is from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import {
    EntityEvent,
    EventParams,
    makeEvent as makeBaseEvent,
} from 'src/entities/entity-event';
import { entityType } from 'src/entities/todo-list';

const eventName = EventName.LIST_CREATED;

interface Payload {
    owner: string;
    title: string;
}

interface EventListCreated extends EntityEvent {
    readonly payload: Payload;
}

const makeEvent = (
    params: Omit<EventParams, 'entityType' | 'eventName'> & {
        payload: Payload;
    },
): EventListCreated => ({
    ...makeBaseEvent({ ...params, entityType, eventName }),
    payload: params.payload,
});

const isEvent = (event: EntityEvent): event is EventListCreated =>
    event.eventName === eventName;

function assertIsValidEvent(
    event: EntityEvent,
): asserts event is EventListCreated {
    if (event.eventName !== eventName)
        throw new Error(`event does not have eventName of ${eventName}`);
    if (!is.plainObject((event as EventListCreated).payload))
        throw new Error('event missing payload');
    if (!is.string((event as EventListCreated).payload.owner))
        throw new Error('event payload has invalid value for owner');
    if (!is.string((event as EventListCreated).payload.title))
        throw new Error('event payload has invalid value for title');
}

export {
    // eslint-disable-next-line no-undef
    EventListCreated,
    isEvent as isEventListCreated,
    assertIsValidEvent as assertIsValidEventListCreated,
    makeEvent as makeEventListCreated,
};
