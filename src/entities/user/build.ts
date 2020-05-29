import { uniq } from 'lodash';
import { EventName } from 'src/lib/enums';
import {
    EntityEvent,
    EventHandler,
    EventMapper,
    buildEntityFromEvents,
} from 'src/entities/entity-event';
import { User, newUser } from '../user';
import {
    assertIsValidEventUserCreated,
    assertIsValidEventUserRoleAdded,
    assertIsValidEventUserRoleRemoved,
} from './events';

const handleUserCreated: EventHandler<User> = (user, event) => {
    if (user) throw new Error('handleUserCreated: user should not exist');
    assertIsValidEventUserCreated(event);
    return newUser({
        userId: event.entityId,
        email: event.payload.email,
    });
};

const handleUserRoleAdded: EventHandler<User> = (user, event) => {
    if (!user) throw new Error('handleRoleAdded: no user');
    assertIsValidEventUserRoleAdded(event);
    user.roles = uniq([...user.roles, event.payload.role]);
    return user;
};

const handleUserRoleRemoved: EventHandler<User> = (user, event) => {
    if (!user) throw new Error('handleRoleRemoved: no user');
    assertIsValidEventUserRoleRemoved(event);
    user.roles = user.roles.filter((role) => role !== event.payload.role);
    return user;
};

const eventMapper: EventMapper<User> = {
    [EventName.USER_CREATED]: handleUserCreated,
    [EventName.USER_ROLE_ADDED]: handleUserRoleAdded,
    [EventName.USER_ROLE_REMOVED]: handleUserRoleRemoved,
};

export default (prev: User | undefined, events: EntityEvent[]): User =>
    buildEntityFromEvents(eventMapper, prev, events);
