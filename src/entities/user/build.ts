import { uniq } from 'lodash';
import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import buildEntity from 'src/util/build-entity';
import { User, newUser } from '../user';
import {
    assertIsValidEventUserCreated,
    assertIsValidEventUserRoleAdded,
    assertIsValidEventUserRoleRemoved,
} from './events';

type EventHandler<K> = (prev: K | undefined, event: EntityEvent) => K;
type EventMapper<K> = Partial<Record<EventName, EventHandler<K>>>;

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

const applyEvent = (prev: User | undefined, event: EntityEvent): User => {
    const handler = eventMapper[event.eventName];
    if (!handler) throw new Error(`Unknown event ${event.eventName}`);
    return handler(prev, event);
};

export default (prev: User | undefined, events: EntityEvent[]): User =>
    buildEntity(prev, events, applyEvent);
