import is from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import {
    EntityEvent,
    EventParams,
    makeEvent as makeBaseEvent,
} from 'src/entities/entity-event';
import { Role } from 'src/entities/authorization';
import { entityType } from 'src/entities/user';

const eventName = EventName.USER_ROLE_REMOVED;

interface Payload {
    role: Role;
}

interface EventUserRoleRemoved extends EntityEvent {
    readonly payload: Payload;
}

const makeEvent = (
    params: Omit<EventParams, 'entityType' | 'eventName'> & {
        payload: Payload;
    },
): EventUserRoleRemoved => ({
    ...makeBaseEvent({ ...params, entityType, eventName }),
    payload: params.payload,
});

const isEvent = (event: EntityEvent): event is EventUserRoleRemoved =>
    event.eventName === eventName;

function assertIsValidEvent(
    event: EntityEvent,
): asserts event is EventUserRoleRemoved {
    if (event.eventName !== eventName)
        throw new Error(`event does not have eventName of ${eventName}`);
    if (!is.plainObject((event as EventUserRoleRemoved).payload))
        throw new Error('event missing payload');
    if (!is.string((event as EventUserRoleRemoved).payload.role))
        throw new Error('event payload has invalid value for role');
}

export {
    // eslint-disable-next-line no-undef
    EventUserRoleRemoved,
    isEvent as isEventUserRoleRemoved,
    assertIsValidEvent as assertIsValidEventUserRoleRemoved,
    makeEvent as makeEventUserRoleRemoved,
};
