import is from '@sindresorhus/is';
import { EntityType, EventName } from 'src/lib/enums';
import {
    EntityEvent,
    EventParams,
    makeEvent as makeBaseEvent,
} from 'src/entities/entity-event';
import { Role } from 'src/entities/authorization';

const entityType = EntityType.User;
const eventName = EventName.USER_ROLE_ADDED;

interface Payload {
    role: Role;
}

interface Event extends EntityEvent {
    readonly payload: Payload;
}

const makeEvent = (
    params: Omit<EventParams, 'entityType' | 'eventName'> & {
        payload: Payload;
    },
): Event => ({
    ...makeBaseEvent({ ...params, entityType, eventName }),
    payload: params.payload,
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
    Event as EventUserRoleAdded,
    assertIsValidEvent as assertIsValidEventUserRoleAdded,
    makeEvent as makeEventUserRoleAdded,
};
