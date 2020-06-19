import {
    generateEvent,
    generateStartingEvent,
} from 'src/event-management/event';
import {
    UserCreated,
    UserRoleAdded,
    UserRoleRemoved,
} from 'src/events/user-events';
import { getAgentId } from 'src/entities/agent';
import { User } from 'src/entities/user';

const schemaVersion = 1;

export const generateEventUserCreated = generateStartingEvent(
    schemaVersion,
    getAgentId,
    UserCreated,
);

const generateUserEvent = generateEvent(
    schemaVersion,
    getAgentId,
    (user: User) => user.userId,
);

export const generateEventUserRoleAdded = generateUserEvent(UserRoleAdded);

export const generateEventUserRoleRemoved = generateUserEvent(UserRoleRemoved);
