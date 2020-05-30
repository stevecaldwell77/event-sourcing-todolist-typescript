// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import getId from 'src/util/get-id';
import { buildUser, newUser, commands } from 'src/entities/user';
import { Role } from 'src/entities/authorization';
import initializeUser from 'test/helpers/initialize-user';
import { EntityEvent } from 'src/entities/entity-event';

const runSetup = () => {
    const { events, userId, agent, email } = initializeUser();
    const user = buildUser(undefined, events);
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
        user,
        commands.addRoleToUser({
            agent,
            user,
            role: Role.ADMIN,
        }),
    );
    t.deepEqual(user.roles, [Role.ADMIN], 'admin role added to user');

    user = buildUser(
        user,
        commands.removeRoleFromUser({
            agent,
            user,
            role: Role.ADMIN,
        }),
    );
    t.deepEqual(user.roles, [], 'admin role revoved from user');
});

test('permissions', (t) => {
    const adminUser = newUser({
        userId: getId(),
        email: 'admin@example.com',
    });
    adminUser.roles = [Role.ADMIN];

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
            message: 'CREATE_USER NOT ALLOWED',
        },
        'non-admin user cannot create a user',
    );
});
