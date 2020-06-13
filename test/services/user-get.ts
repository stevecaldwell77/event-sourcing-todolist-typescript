import test from 'ava';
import UserService from 'src/services/user';
import EventStoreInMemory from 'src/event-store/in-memory';
import { systemAgent } from 'src/entities/agent';
import { newUser } from 'src/entities/user';
import getId from 'src/util/get-id';
import getAdminUser from 'test/helpers/get-admin-user';

const eventStore = new EventStoreInMemory();
const userService = new UserService({ eventStore });

test('get(): success', async (t) => {
    const userId = getId();
    const email = 'jdoe@example.com';

    await userService.create(userId, systemAgent, { email });

    const result = await userService.get(userId, systemAgent);

    t.deepEqual(
        result,
        newUser({
            email,
            userId,
        }),
        'user fetched correctly',
    );
});

test('get(): miss', async (t) => {
    const userId = getId();
    const result = await userService.get(userId, systemAgent);
    t.is(result, undefined, 'undefined returned on unknown user');
});

test('get(): authorization', async (t) => {
    const userId = getId();
    const email = 'jdoe@example.com';
    const adminUser = getAdminUser();

    const user = await userService.create(userId, systemAgent, {
        email,
    });

    const otherUser = newUser({
        userId: getId(),
        email: 'other@example.com',
    });

    await t.notThrowsAsync(
        () => userService.get(userId, adminUser),
        'admin user can read a user',
    );

    await t.notThrowsAsync(
        () => userService.get(userId, user),
        'non-admin user can read itself',
    );

    await t.throwsAsync(
        () => userService.get(userId, otherUser),
        {
            message: 'NOT ALLOWED: READ_USER',
        },
        'a non-admin user cannot read another user',
    );
});
