import is from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import {
    EntityEvent,
    EventParams,
    makeEvent as makeBaseEvent,
} from 'src/entities/entity-event';
import { entityType } from 'src/entities/user';

const eventName = EventName.USER_CREATED;

interface Payload {
    email: string;
}

interface EventUserCreated extends EntityEvent {
    readonly payload: Payload;
}

const makeEvent = (
    params: Omit<EventParams, 'entityType' | 'eventName'> & {
        payload: Payload;
    },
): EventUserCreated => ({
    ...makeBaseEvent({ ...params, entityType, eventName }),
    payload: params.payload,
});

const isEvent = (event: EntityEvent): event is EventUserCreated =>
    event.eventName === eventName;

function assertIsValidEvent(
    event: EntityEvent,
): asserts event is EventUserCreated {
    if (event.eventName !== eventName)
        throw new Error(`event does not have eventName of ${eventName}`);
    if (!is.plainObject((event as EventUserCreated).payload))
        throw new Error('event missing payload');
    if (!is.string((event as EventUserCreated).payload.email))
        throw new Error('event payload has invalid value for email');
}

export {
    // eslint-disable-next-line no-undef
    EventUserCreated,
    isEvent as isEventUserCreated,
    assertIsValidEvent as assertIsValidEventUserCreated,
    makeEvent as makeEventUserCreated,
};
