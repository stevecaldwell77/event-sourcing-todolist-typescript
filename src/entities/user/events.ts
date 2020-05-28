import { EntityType, EventName } from 'src/lib/enums';
import { Role } from 'src/shared/authorization';
import { EntityEvent } from 'src/interfaces/entity-event';
import { makeEvent } from 'src/shared/make-event';
import { Agent } from 'src/shared/agent';

export interface EventUserCreated extends EntityEvent {
    readonly payload: {
        email: string;
    };
}

export interface EventUserRoleAdded extends EntityEvent {
    readonly payload: {
        role: Role;
    };
}

export interface EventUserRoleRemoved extends EntityEvent {
    readonly payload: {
        role: Role;
    };
}

interface UserEventFactoryParams {
    eventId?: string;
    eventTimestamp?: number;
    eventRevision: number;
    userId: string;
    agent: Agent;
}

const makeUserEvent = (
    params: UserEventFactoryParams & { eventName: EventName },
): EntityEvent =>
    makeEvent({
        ...params,
        entity: EntityType.User,
        entityId: params.userId,
    });

export const makeEventUserCreated = (params: {
    agent: Agent;
    userId: string;
    email: string;
    eventRevision: number;
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
    },
});

export const makeEventUserRoleAdded = (
    params: UserEventFactoryParams & { role: Role },
): EventUserRoleAdded => ({
    ...makeUserEvent({
        ...params,
        eventName: EventName.USER_ROLE_ADDED,
    }),
    payload: {
        role: params.role,
    },
});

export const makeEventUserRoleRemoved = (
    params: UserEventFactoryParams & { role: Role },
): EventUserRoleRemoved => ({
    ...makeUserEvent({
        ...params,
        eventName: EventName.USER_ROLE_REMOVED,
    }),
    payload: {
        role: params.role,
    },
});

export const isEventUserCreated = (
    event: EntityEvent,
): event is EventUserCreated => event.eventName === EventName.USER_CREATED;

export const isEventUserRoleAdded = (
    event: EntityEvent,
): event is EventUserRoleAdded => event.eventName === EventName.USER_ROLE_ADDED;

export const isEventUserRoleRemoved = (
    event: EntityEvent,
): event is EventUserRoleRemoved =>
    event.eventName === EventName.USER_ROLE_REMOVED;
