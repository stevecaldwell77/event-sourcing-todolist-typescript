// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import getId from 'src/util/get-id';
import { makeUser, commands } from 'src/entities/user';
import { systemAgent } from 'src/shared/agent';

test('createUser()', (t) => {
    const agent = systemAgent;
    const userId = getId();
    const user = makeUser(
        undefined,
        commands.createUser({
            agent,
            userId,
            email: 'jdoe@gmail.com',
        }),
    );
    t.deepEqual(
        user,
        {
            userId,
            revision: 1,
            email: 'jdoe@gmail.com',
            roles: [],
        },
        'inital user created correctly',
    );
});
