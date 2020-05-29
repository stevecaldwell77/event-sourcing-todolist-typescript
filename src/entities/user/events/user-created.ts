import is from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/entities/entity-event';
import { UserEventParams, makeUserEvent } from '../events';

const eventName = EventName.USER_CREATED;

interface Event extends EntityEvent {
    readonly payload: {
        email: string;
    };
}

const makeEvent = (params: UserEventParams & { email: string }): Event => ({
    ...makeUserEvent(params, eventName),
    payload: {
        email: params.email,
    },
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
