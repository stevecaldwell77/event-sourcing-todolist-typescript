import assert from 'assert';
import * as t from 'io-ts';
import { Agent } from 'src/entities/agent';

export type Role = t.TypeOf<typeof roleSchema>;

export const roleSchema = t.keyof({
    ADMIN: null,
});

export enum Permission {
    USER_CREATE = 'USER_CREATE',
    USER_READ_ALL = 'USER_READ_ALL',
    USER_MANAGE_ROLES = 'USER_MANAGE_ROLES',
    LIST_READ_ALL = 'LIST_READ_ALL',
}

export type Authorization<K> = {
    assertRead: (agent: Agent, entity: K) => void;
    assertCommand: (agent: Agent, command: string, entity?: K) => void;
};

const rolePermissions: Record<Role, Permission[]> = {
    ADMIN: [
        Permission.USER_CREATE,
        Permission.USER_READ_ALL,
        Permission.USER_MANAGE_ROLES,
        Permission.LIST_READ_ALL,
    ],
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
