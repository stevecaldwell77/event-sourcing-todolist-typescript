import is from '@sindresorhus/is';
import { EntityType, EventName } from 'src/lib/enums';
import {
    EntityEvent,
    EventParams,
    makeEvent as makeBaseEvent,
} from 'src/entities/entity-event';

const entityType = EntityType.User;
const eventName = EventName.USER_CREATED;

interface Payload {
    email: string;
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
    if (!is.string((event as Event).payload.email))
        throw new Error('event payload has invalid value for email');
}

export {
    // eslint-disable-next-line no-undef
    Event as EventUserCreated,
    isEvent as isEventUserCreated,
    assertIsValidEvent as assertIsValidEventUserCreated,
    makeEvent as makeEventUserCreated,
};
