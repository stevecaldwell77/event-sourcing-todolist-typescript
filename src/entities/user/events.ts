import { EntityType, EventName } from 'src/lib/enums';
import { Role } from 'src/shared/authorization';
import { EntityEvent } from 'src/interfaces/entity-event';
import { makeEvent } from 'src/shared/make-event';
import { Agent } from 'src/shared/agent';

export interface EventUserCreated extends EntityEvent {
    readonly payload: {
        email: string;
        roles: Role[];
    };
}

export const makeEventUserCreated = (params: {
    agent: Agent;
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
        agent: params.agent,
    }),
    payload: {
        email: params.email,
        roles: params.roles,
    },
});

export const isEventUserCreated = (
    event: EntityEvent,
): event is EventUserCreated => event.eventName === EventName.USER_CREATED;
