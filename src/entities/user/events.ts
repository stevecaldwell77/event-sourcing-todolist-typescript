import { EntityType, EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { makeEvent } from 'src/shared/make-event';
import { Agent } from 'src/shared/agent';
import {
    EventUserCreated,
    isEventUserCreated,
    makeEventUserCreated,
} from './events/user-created';
import {
    EventUserRoleAdded,
    isEventUserRoleAdded,
    makeEventUserRoleAdded,
} from './events/user-role-added';
import {
    EventUserRoleRemoved,
    isEventUserRoleRemoved,
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
        entity: EntityType.User,
        entityId: params.userId,
    });

export {
    EventUserCreated,
    EventUserRoleAdded,
    EventUserRoleRemoved,
    isEventUserCreated,
    isEventUserRoleAdded,
    isEventUserRoleRemoved,
    makeEventUserCreated,
    makeEventUserRoleAdded,
    makeEventUserRoleRemoved,
};
