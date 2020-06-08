import * as t from 'io-ts';
import { EntityType } from 'src/lib/enums';
import { assertSchema } from 'src/util/assert';
import {
    roleSchema,
    Permission,
    agentHasPermission,
} from 'src/entities/authorization';
import { Agent, getUserId } from 'src/entities/agent';
import buildEntity from './user/build';
import * as commands from './user/commands';

export const entityType = EntityType.User;

export type User = t.TypeOf<typeof userSchema>;

const userSchema = t.type({
    userId: t.string,
    email: t.string,
    revision: t.number,
    roles: t.array(roleSchema),
});

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

const buildUser = buildEntity;

const assertValidUser = assertSchema(userSchema);

export { buildUser, commands, newUser, assertValidUser, assertReadAuthorized };
