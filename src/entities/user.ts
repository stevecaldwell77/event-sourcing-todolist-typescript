import { StructType, assert, object, number, string, array } from 'superstruct';
import { AgentRole } from 'src/entities/agent';

export type User = StructType<typeof User>;

const User = object({
    userId: string(),
    email: string(),
    revision: number(),
    roles: array(AgentRole),
});

export const assertUser = (v: unknown): asserts v is User => assert(v, User);

export const newUser = (params: { userId: string; email: string }): User => ({
    ...params,
    roles: [],
    revision: 1,
});
