import { EntityType, EventName } from 'src/lib/enums';
import { EntityEvent, makeEvent } from 'src/entities/entity-event';
import { Agent } from 'src/shared/agent';
import {
    EventUserCreated,
    isEventUserCreated,
    makeEventUserCreated,
} from './events/user-created';
import {
    EventUserRoleAdded,
    makeEventUserRoleAdded,
} from './events/user-role-added';
import {
    EventUserRoleRemoved,
    makeEventUserRoleRemoved,
} from './events/user-role-removed';

export interface UserEventParams {
    eventId?: string;
    eventTimestamp?: number;
    eventRevision: number;
    userId: string;
    agent: Agent;
}

export const makeUserEvent = (
    params: UserEventParams,
    eventName: EventName,
): EntityEvent =>
    makeEvent({
        ...params,
        eventName,
        entityType: EntityType.User,
        entityId: params.userId,
    });

export {
    EventUserCreated,
    EventUserRoleAdded,
    EventUserRoleRemoved,
    isEventUserCreated,
    makeEventUserCreated,
    makeEventUserRoleAdded,
    makeEventUserRoleRemoved,
};
