import assert from 'assert';

export enum Role {
    ADMIN = 'ADMIN',
}

export interface HasRole {
    roles: Role[];
}

export enum Permission {
    CREATE_USER = 'CREATE_USER',
}

const rolePermissions: Record<Role, Permission[]> = {
    [Role.ADMIN]: [Permission.CREATE_USER],
};

export const requestorHasPermission = (
    requestor: HasRole,
    permission: Permission,
): boolean => {
    for (const role of requestor.roles) {
        const permissions = rolePermissions[role];
        if (permissions && permissions.includes(permission)) return true;
    }

    return false;
};

export const assertRequestorHasPermission = (
    requestor: HasRole,
    permission: Permission,
): void => {
    assert(
        requestorHasPermission(requestor, permission),
        `${permission} NOT ALLOWED`,
    );
};
