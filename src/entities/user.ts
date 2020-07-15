import { StructType, object, number, string, array } from 'superstruct';
import { AgentRole } from 'src/events/enums';
import { assertType } from 'src/util/types';

export type User = StructType<typeof User>;

const User = object({
    userId: string(),
    email: string(),
    revision: number(),
    roles: array(AgentRole),
});

export const assertUser = assertType(User);

export const newUser = (params: { userId: string; email: string }): User => ({
    ...params,
    roles: [],
    revision: 1,
});
