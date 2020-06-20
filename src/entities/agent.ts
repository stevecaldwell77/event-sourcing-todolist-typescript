import assert from 'assert';
import * as t from 'io-ts';
import { User } from 'src/entities/user';
import { SystemAgent } from 'src/entities/system-agent';

export type Agent = User | SystemAgent;

export type AgentRole = t.TypeOf<typeof agentRoleSchema>;
export const agentRoleSchema = t.keyof({
    ADMIN: null,
});

export enum Permission {
    USER_CREATE = 'USER_CREATE',
    USER_READ_ALL = 'USER_READ_ALL',
    USER_MANAGE_ROLES = 'USER_MANAGE_ROLES',
    LIST_READ_ALL = 'LIST_READ_ALL',
}

const rolePermissions: Record<AgentRole, Permission[]> = {
    ADMIN: [
        Permission.USER_CREATE,
        Permission.USER_READ_ALL,
        Permission.USER_MANAGE_ROLES,
        Permission.LIST_READ_ALL,
    ],
};

const isUser = (agent: Agent): agent is User => {
    return (agent as User).userId !== undefined;
};

export const getUserId = (agent: Agent): string | undefined => {
    return isUser(agent) ? agent.userId : undefined;
};

export const getAgentId = (agent: Agent): string => {
    return isUser(agent) ? agent.userId : agent.agentId;
};

export const agentHasPermission = (
    agent: Agent,
    permission: Permission,
): boolean => {
    for (const role of agent.roles) {
        const permissions = rolePermissions[role];
        if (permissions && permissions.includes(permission)) return true;
    }

    return false;
};

export const assertAgentHasPermission = (
    agent: Agent,
    permission: Permission,
): void => {
    assert(agentHasPermission(agent, permission), `NOT ALLOWED: ${permission}`);
};
