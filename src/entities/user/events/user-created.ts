import { assert } from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
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

const isEvent = (event: EntityEvent): event is Event => {
    if (event.eventName !== eventName) return false;
    assert.plainObject((event as Event).payload);
    assert.string((event as Event).payload.email);
    return true;
};

export {
    // eslint-disable-next-line no-undef
    Event as EventUserCreated,
    isEvent as isEventUserCreated,
    makeEvent as makeEventUserCreated,
};
