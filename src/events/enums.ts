import * as t from 'io-ts';

export type UserRole = t.TypeOf<typeof userRoleSchema>;

export const userRoleSchema = t.keyof({
    ADMIN: null,
});
