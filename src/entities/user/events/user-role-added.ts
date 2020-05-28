import { assert } from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { Role } from 'src/shared/authorization';
import { UserEventParams, makeUserEvent } from '../events';

const eventName = EventName.USER_ROLE_ADDED;

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

const isEvent = (event: EntityEvent): event is Event => {
    if (event.eventName !== eventName) return false;
    assert.plainObject((event as Event).payload);
    assert.string((event as Event).payload.role);
    return true;
};

export {
    // eslint-disable-next-line no-undef
    Event as EventUserRoleAdded,
    isEvent as isEventUserRoleAdded,
    makeEvent as makeEventUserRoleAdded,
};
