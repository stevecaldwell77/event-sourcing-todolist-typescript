import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { UserEventParams, makeUserEvent } from '../events';

const eventName = EventName.USER_CREATED;

export interface EventUserCreated extends EntityEvent {
    readonly payload: {
        email: string;
    };
}

export const makeEventUserCreated = (
    params: UserEventParams & { email: string },
): EventUserCreated => ({
    ...makeUserEvent(params, eventName),
    payload: {
        email: params.email,
    },
});

export const isEventUserCreated = (
    event: EntityEvent,
): event is EventUserCreated => event.eventName === eventName;
