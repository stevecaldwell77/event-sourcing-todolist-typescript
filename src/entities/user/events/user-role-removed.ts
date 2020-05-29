import is from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/entities/entity-event';
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

function assertIsValidEvent(event: EntityEvent): asserts event is Event {
    if (event.eventName !== eventName)
        throw new Error(`event does not have eventName of ${eventName}`);
    if (!is.plainObject((event as Event).payload))
        throw new Error('event missing payload');
    if (!is.string((event as Event).payload.role))
        throw new Error('event payload has invalid value for role');
}

export {
    // eslint-disable-next-line no-undef
    Event as EventUserRoleRemoved,
    assertIsValidEvent as assertIsValidEventUserRoleRemoved,
    makeEvent as makeEventUserRoleRemoved,
};
