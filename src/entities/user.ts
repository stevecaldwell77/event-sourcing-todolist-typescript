import { uniq } from 'lodash';
import { Role } from 'src/shared/authorization';
import { EntityEvent } from 'src/interfaces/entity-event';
import {
    EventUserCreated,
    EventUserRoleAdded,
    EventUserRoleRemoved,
    isEventUserCreated,
    isEventUserRoleAdded,
    isEventUserRoleRemoved,
} from './user/events';
import * as commands from './user/commands';

export interface User {
    userId: string;
    email: string;
    revision: number;
    roles: Role[];
}

const newUser = (event: EventUserCreated): User => ({
    revision: 1,
    userId: event.entityId,
    email: event.payload.email,
    roles: [],
});

const handleRoleAdded = (user: User, event: EventUserRoleAdded) => {
    user.roles = uniq([...user.roles, event.payload.role]);
    return user;
};

const handleRoleRemoved = (user: User, event: EventUserRoleRemoved) => {
    user.roles = user.roles.filter((role) => role !== event.payload.role);
    return user;
};

const applyEvent = (prev: User | undefined, event: EntityEvent): User => {
    if (isEventUserCreated(event)) return newUser(event);
    if (!prev)
        throw new Error('cannot apply non-create event without previous user');
    if (isEventUserRoleAdded(event)) return handleRoleAdded(prev, event);
    if (isEventUserRoleRemoved(event)) return handleRoleRemoved(prev, event);
    throw new Error('Unknown event');
};

const makeUser = (prev: User | undefined, events: EntityEvent[]): User => {
    const user = events.reduce(applyEvent, prev);
    if (!user) throw new Error('Unexpected error');
    const lastEvent = events[events.length - 1];
    user.revision = lastEvent.eventRevision;
    return user;
};

export { makeUser, commands };
