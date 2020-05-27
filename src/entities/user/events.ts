import { EntityEvent, makeEvent } from '../event';
import { EntityType, EventName } from '../enums';

export interface EventUserCreated extends EntityEvent {
    readonly payload: {
        email: string;
    };
}

export const makeEventUserCreated = (params: {
    eventUserId: string;
    userId: string;
    email: string;
    eventRevision: number;
}): EventUserCreated => ({
    ...makeEvent({
        eventName: EventName.USER_CREATED,
        eventRevision: params.eventRevision,
        entity: EntityType.User,
        entityId: params.userId,
        eventUserId: params.eventUserId,
    }),
    payload: {
        email: params.email,
    },
});

export const isEventUserCreated = (
    event: EntityEvent,
): event is EventUserCreated => event.eventName === EventName.USER_CREATED;
