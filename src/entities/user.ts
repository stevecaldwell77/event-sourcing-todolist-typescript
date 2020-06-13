import * as t from 'io-ts';
import { EntityType } from 'src/lib/enums';
import { roleSchema } from 'src/entities/authorization';
import { mapOrDie } from 'src/util/io-ts';

export const entityType = EntityType.User;

export type User = t.TypeOf<typeof userSchema>;

const userSchema = t.type({
    userId: t.string,
    email: t.string,
    revision: t.number,
    roles: t.array(roleSchema),
});

const newUser = (params: { userId: string; email: string }): User => ({
    revision: 1,
    userId: params.userId,
    email: params.email,
    roles: [],
});

const mapToUser = mapOrDie(userSchema);

export { newUser, mapToUser };
