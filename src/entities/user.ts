import * as t from 'io-ts';
import { agentRoleSchema } from 'src/entities/agent';
import { mapOrDie } from 'src/util/io-ts';

export type User = t.TypeOf<typeof userSchema>;

const userSchema = t.type({
    userId: t.string,
    email: t.string,
    revision: t.number,
    roles: t.array(agentRoleSchema),
});

export const mapToUser = mapOrDie(userSchema);

export const newUser = (params: { userId: string; email: string }): User => ({
    ...params,
    roles: [],
    revision: 1,
});
