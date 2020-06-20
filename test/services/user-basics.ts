import test from 'ava';
import { assert } from '@sindresorhus/is/dist';
import getId from 'src/util/get-id';
import { systemAgent } from 'src/entities/system-agent';
import { newUser } from 'src/entities/user';
import { EntityType } from 'src/lib/enums';
import getAdminUser from 'test/helpers/get-admin-user';
import { userService } from 'test/helpers/services';

test('UserService: create() and get()', async (t) => {
    const userId = getId();
    const email = 'jdoe@example.com';
    const getEvents = () =>
        userService.eventStore.getEvents(EntityType.User, userId);

    t.deepEqual(await getEvents(), [], 'no events initially');

    await userService.create(userId, systemAgent, { email });

    const events = await getEvents();
    t.is(events.length, 1, 'one event saved after calling create()');

    const user = await userService.get(userId, systemAgent);

    t.truthy(user, 'user can be fetched afteward creation');
    assert.object(user);
    t.deepEqual(
        user,
        newUser({
            email,
            userId,
        }),
        'inital user created correctly',
    );
});

test('UserService.create(): error on duplicate', async (t) => {
    const userId = getId();
    const email = 'jdoe@example.com';

    const runCommand = () =>
        userService.create(userId, systemAgent, {
            email,
        });

    await runCommand();

    await t.throwsAsync(
        () => runCommand(),
        {
            message: `UserService.create(): ${userId} already exists`,
        },
        'error thrown when trying to create duplicate user',
    );
});

test('UserService.create(): permissions', async (t) => {
    const adminUser = getAdminUser();

    const nonAdminUser = newUser({
        userId: getId(),
        email: 'nonadmin@example.com',
    });
    nonAdminUser.roles = [];

    await t.notThrowsAsync(
        () =>
            userService.create(getId(), adminUser, {
                email: 'newuser1@example.com',
            }),
        'admin user can create a user',
    );

    await t.throwsAsync(
        () =>
            userService.create(getId(), nonAdminUser, {
                email: 'newuser2@example.com',
            }),
        {
            message: 'NOT ALLOWED: USER_CREATE',
        },
        'non-admin user cannot create a user',
    );
});

test('UserService.get(): permissions', async (t) => {
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

test('UserService.get(): miss', async (t) => {
    const userId = getId();
    const result = await userService.get(userId, systemAgent);
    t.is(result, undefined, 'undefined returned on unknown user');
});
