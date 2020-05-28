import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { Role } from 'src/shared/authorization';
import { UserEventParams, makeUserEvent } from '../events';

const eventName = EventName.USER_ROLE_ADDED;

export interface EventUserRoleAdded extends EntityEvent {
    readonly payload: {
        role: Role;
    };
}

export const makeEventUserRoleAdded = (
    params: UserEventParams & { role: Role },
): EventUserRoleAdded => ({
    ...makeUserEvent(params, eventName),
    payload: {
        role: params.role,
    },
});

export const isEventUserRoleAdded = (
    event: EntityEvent,
): event is EventUserRoleAdded => event.eventName === eventName;
