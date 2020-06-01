// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import getId from 'src/util/get-id';
import { User, buildUser, newUser, commands } from 'src/entities/user';
import { Role } from 'src/entities/authorization';
import initializeUser from 'test/helpers/initialize-user';
import getAdminUser from 'test/helpers/get-admin-user';

const runSetup = () => {
    const { events, userId, agent, email } = initializeUser();
    const user = buildUser(agent, undefined, events);
    return { events, agent, userId, user, email };
};

test('createUser()', (t) => {
    const { userId, user, email } = runSetup();
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

test('adding and removing roles', (t) => {
    const setup = runSetup();
    const { agent } = setup;
    let { user } = setup;

    user = buildUser(
        agent,
        user,
        commands.addRoleToUser({
            agent,
            user,
            role: Role.ADMIN,
        }),
    );
    t.deepEqual(user.roles, [Role.ADMIN], 'admin role added to user');

    user = buildUser(
        agent,
        user,
        commands.removeRoleFromUser({
            agent,
            user,
            role: Role.ADMIN,
        }),
    );
    t.deepEqual(user.roles, [], 'admin role revoved from user');
});

test('permissions: create user', (t) => {
    const adminUser = getAdminUser();

    const nonAdminUser = newUser({
        userId: getId(),
        email: 'nonadmin@example.com',
    });
    nonAdminUser.roles = [];

    t.notThrows(
        () =>
            commands.createUser({
                userId: getId(),
                agent: adminUser,
                email: 'newuser@example.com',
            }),
        'admin user can create a user',
    );

    t.throws(
        () =>
            commands.createUser({
                userId: getId(),
                agent: nonAdminUser,
                email: 'newuser@example.com',
            }),
        {
            message: 'NOT ALLOWED: USER_CREATE',
        },
        'non-admin user cannot create a user',
    );
});

test('permissions: read user', (t) => {
    const adminUser = getAdminUser();
    const { events: events1 } = initializeUser({ agent: adminUser });
    const { events: events2 } = initializeUser({ agent: adminUser });

    let user1: User;
    t.notThrows(() => {
        user1 = buildUser(adminUser, undefined, events1);
    }, 'admin user can read a user');

    t.notThrows(() => {
        buildUser(user1, undefined, events1);
    }, 'non-admin user can read itself');

    t.throws(
        () => {
            buildUser(user1, undefined, events2);
        },
        {
            message: 'NOT ALLOWED: READ_USER',
        },
        'a non-admin user cannot read another user',
    );
});
