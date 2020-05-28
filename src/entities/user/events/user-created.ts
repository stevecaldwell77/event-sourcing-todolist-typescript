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

const isEvent = (event: EntityEvent): event is Event =>
    event.eventName === eventName;

export {
    // eslint-disable-next-line no-undef
    Event as EventUserCreated,
    isEvent as isEventUserCreated,
    makeEvent as makeEventUserCreated,
};
