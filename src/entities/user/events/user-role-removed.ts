import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { Role } from 'src/shared/authorization';
import { UserEventParams, makeUserEvent } from '../events';

const eventName = EventName.USER_ROLE_REMOVED;

export interface EventUserRoleRemoved extends EntityEvent {
    readonly payload: {
        role: Role;
    };
}

export const makeEventUserRoleRemoved = (
    params: UserEventParams & { role: Role },
): EventUserRoleRemoved => ({
    ...makeUserEvent(params, eventName),
    payload: {
        role: params.role,
    },
});

export const isEventUserRoleRemoved = (
    event: EntityEvent,
): event is EventUserRoleRemoved => event.eventName === eventName;
