import { uniq } from 'lodash';
import { EntityEvent } from 'src/interfaces/entity-event';
import { User, newUser } from '../user';
import {
    EventUserCreated,
    EventUserRoleAdded,
    EventUserRoleRemoved,
    isEventUserCreated,
    isEventUserRoleAdded,
    isEventUserRoleRemoved,
} from './events';

const handleUserCreated = (event: EventUserCreated) =>
    newUser({
        userId: event.entityId,
        email: event.payload.email,
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
    if (isEventUserCreated(event)) return handleUserCreated(event);
    if (!prev)
        throw new Error('cannot apply non-create event without previous user');
    if (isEventUserRoleAdded(event)) return handleRoleAdded(prev, event);
    if (isEventUserRoleRemoved(event)) return handleRoleRemoved(prev, event);
    throw new Error('Unknown event');
};

const buildUser = (prev: User | undefined, events: EntityEvent[]): User => {
    const user = events.reduce(applyEvent, prev);
    if (!user) throw new Error('Unexpected error');
    const lastEvent = events[events.length - 1];
    user.revision = lastEvent.eventRevision;
    return user;
};

export default buildUser;
