import assert from 'assert';
import { Agent } from 'src/shared/agent';

export enum Role {
    ADMIN = 'ADMIN',
}

export enum Permission {
    CREATE_USER = 'CREATE_USER',
}

const rolePermissions: Record<Role, Permission[]> = {
    [Role.ADMIN]: [Permission.CREATE_USER],
};

export const requestorHasPermission = (
    agent: Agent,
    permission: Permission,
): boolean => {
    for (const role of agent.roles) {
        const permissions = rolePermissions[role];
        if (permissions && permissions.includes(permission)) return true;
    }

    return false;
};

export const assertRequestorHasPermission = (
    agent: Agent,
    permission: Permission,
): void => {
    assert(
        requestorHasPermission(agent, permission),
        `${permission} NOT ALLOWED`,
    );
};
