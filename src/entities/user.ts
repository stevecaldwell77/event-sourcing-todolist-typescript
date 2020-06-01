import { EntityType } from 'src/lib/enums';
import {
    Role,
    Permission,
    assertAgentHasPermission,
} from 'src/entities/authorization';
import { Agent, getUserId } from 'src/entities/agent';
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

const assertAuthorized = (agent: Agent, user: User): void => {
    if (getUserId(agent) === user.userId) return;
    assertAgentHasPermission(agent, Permission.READ_USERS);
};

const buildUser = (
    agent: Agent,
    prev: User | undefined,
    events: EntityEvent[],
) => {
    const user = buildEntity(prev, events);
    assertAuthorized(agent, user);
    return user;
};

export { buildUser, commands, newUser };
