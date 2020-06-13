import test from 'ava';
import { assert } from '@sindresorhus/is/dist';
import EventStoreInMemory from 'src/event-store/in-memory';
import getId from 'src/util/get-id';
import { systemAgent } from 'src/entities/agent';
import { newUser } from 'src/entities/user';
import { EntityType } from 'src/lib/enums';
import UserService from 'src/services/user';
import getAdminUser from 'test/helpers/get-admin-user';

const eventStore = new EventStoreInMemory();
const userService = new UserService({ eventStore });

test('successful creation', async (t) => {
    const userId = getId();
    const email = 'jdoe@example.com';
    const getEvents = () => eventStore.getEvents(EntityType.User, userId);

    t.deepEqual(await getEvents(), [], 'no events initially');

    await userService.create(userId, systemAgent, { email });

    const events = await getEvents();
    t.is(events.length, 1, 'one event saved');

    const user = await userService.get(userId, systemAgent);
    t.truthy(user, 'user can be fetched aftewards');
    assert.object(user);
    t.deepEqual(
        user,
        {
            userId,
            revision: 1,
            email,
            roles: [],
        },
        'inital user created correctly',
    );
});

test('error on duplicate', async (t) => {
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

test('permissions', async (t) => {
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
