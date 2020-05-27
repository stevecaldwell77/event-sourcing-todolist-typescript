// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import { Role } from 'src/lib/enums';
import { makeUser, commands } from '../src/entities/user';
import getId from '../src/util/get-id';

test('makeUser: initial', (t) => {
    const userId = getId();
    const user = makeUser(
        undefined,
        commands.createUser({
            commandUserId: '1',
            userId,
            email: 'jdoe@gmail.com',
            roles: [Role.ADMIN],
        }),
    );
    t.deepEqual(
        user,
        {
            userId,
            revision: 1,
            email: 'jdoe@gmail.com',
            roles: [Role.ADMIN],
        },
        'inital user created correctly',
    );
});
