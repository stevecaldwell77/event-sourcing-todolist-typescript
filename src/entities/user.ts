import * as t from 'io-ts';
import { agentRoleSchema } from 'src/entities/agent';
import { coerce } from 'src/util/io-ts';

export type User = t.TypeOf<typeof userSchema>;

const userSchema = t.type({
    userId: t.string,
    email: t.string,
    revision: t.number,
    roles: t.array(agentRoleSchema),
});

export const coerceToUser = coerce(userSchema);

export const newUser = (params: { userId: string; email: string }): User => ({
    ...params,
    roles: [],
    revision: 1,
});
