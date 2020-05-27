import { Role, EntityType, EventName } from 'src/lib/enums';
import { EntityEvent, makeEvent } from 'src/entities/event';

export interface EventUserCreated extends EntityEvent {
    readonly payload: {
        email: string;
        roles: Role[];
    };
}

export const makeEventUserCreated = (params: {
    eventUserId: string;
    userId: string;
    email: string;
    eventRevision: number;
    roles: Role[];
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
        roles: params.roles,
    },
});

export const isEventUserCreated = (
    event: EntityEvent,
): event is EventUserCreated => event.eventName === EventName.USER_CREATED;
