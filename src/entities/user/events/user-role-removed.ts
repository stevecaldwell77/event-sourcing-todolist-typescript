import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { Role } from 'src/shared/authorization';
import { UserEventParams, makeUserEvent } from '../events';

const eventName = EventName.USER_ROLE_REMOVED;

interface Event extends EntityEvent {
    readonly payload: {
        role: Role;
    };
}

const makeEvent = (params: UserEventParams & { role: Role }): Event => ({
    ...makeUserEvent(params, eventName),
    payload: {
        role: params.role,
    },
});

const isEvent = (event: EntityEvent): event is Event =>
    event.eventName === eventName;

export {
    // eslint-disable-next-line no-undef
    Event as EventUserRoleRemoved,
    isEvent as isEventUserRoleRemoved,
    makeEvent as makeEventUserRoleRemoved,
};
