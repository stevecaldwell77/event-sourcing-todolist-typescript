import { EntityType } from 'src/lib/enums';
import {
    Role,
    Permission,
    agentHasPermission,
} from 'src/entities/authorization';
import { Agent, getUserId, getAgentId } from 'src/entities/agent';
import { EntityEvent } from 'src/entities/entity-event';
import buildEntity from './user/build';
import * as commands from './user/commands';

export const entityType = EntityType.User;

export interface User {
    userId: string;
    email: string;
    revision: number;
    roles: Role[];
}

const newUser = (params: { userId: string; email: string }): User => ({
    revision: 1,
    userId: params.userId,
    email: params.email,
    roles: [],
});

const assertReadAuthorized = (agent: Agent, user: User): void => {
    if (getUserId(agent) === user.userId) return;
    if (agentHasPermission(agent, Permission.USER_READ_ALL)) return;
    throw new Error('NOT ALLOWED: READ_USER');
};

const buildUser = (
    agent: Agent,
    prev: User | undefined,
    events: EntityEvent[],
) => {
    const user = buildEntity(prev, events);
    assertReadAuthorized(agent, user);
    return user;
};

export { buildUser, commands, newUser };
