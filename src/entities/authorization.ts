import assert from 'assert';
import { Agent } from 'src/entities/agent';

export enum Role {
    ADMIN = 'ADMIN',
}

export enum Permission {
    CREATE_USER = 'CREATE_USER',
    READ_USERS = 'READ_USERS',
    MANAGE_USER_ROLES = 'MANAGE_USER_ROLES',
}

const rolePermissions: Record<Role, Permission[]> = {
    [Role.ADMIN]: [
        Permission.CREATE_USER,
        Permission.READ_USERS,
        Permission.MANAGE_USER_ROLES,
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
    assert(agentHasPermission(agent, permission), `${permission} NOT ALLOWED`);
};
