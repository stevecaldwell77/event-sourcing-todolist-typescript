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

interface UserEventParams {
    eventId?: string;
    eventTimestamp?: number;
    eventRevision: number;
    userId: string;
    agent: Agent;
}

const makeUserEvent = (
    params: UserEventParams,
    eventName: EventName,
): EntityEvent =>
    makeEvent({
        ...params,
        eventName,
        entity: EntityType.User,
        entityId: params.userId,
    });

export const makeEventUserCreated = (
    params: UserEventParams & { email: string },
): EventUserCreated => ({
    ...makeUserEvent(params, EventName.USER_CREATED),
    payload: {
        email: params.email,
    },
});

export const makeEventUserRoleAdded = (
    params: UserEventParams & { role: Role },
): EventUserRoleAdded => ({
    ...makeUserEvent(params, EventName.USER_ROLE_ADDED),
    payload: {
        role: params.role,
    },
});

export const makeEventUserRoleRemoved = (
    params: UserEventParams & { role: Role },
): EventUserRoleRemoved => ({
    ...makeUserEvent(params, EventName.USER_ROLE_REMOVED),
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
