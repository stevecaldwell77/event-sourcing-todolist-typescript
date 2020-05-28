// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import getId from 'src/util/get-id';
import { buildUser, newUser, commands } from 'src/entities/user';
import { systemAgent } from 'src/shared/agent';
import { Role } from 'src/shared/authorization';
import { EntityEvent } from 'src/interfaces/entity-event';

const runSetup = () => {
    const userId = getId();
    const agent = systemAgent;
    const events: EntityEvent[] = commands.createUser({
        agent,
        userId,
        email: 'jdoe@gmail.com',
    });
    const user = buildUser(undefined, events);
    return { events, agent, userId, user };
};

test('createUser()', (t) => {
    const { userId, user } = runSetup();
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

test('adding and removing roles', (t) => {
    const setup = runSetup();
    const { agent, events } = setup;
    let { user } = setup;

    events.push(
        ...commands.addRoleToUser({
            agent,
            user,
            role: Role.ADMIN,
        }),
    );

    user = buildUser(user, events);
    t.deepEqual(user.roles, [Role.ADMIN], 'admin role added to user');

    events.push(
        ...commands.removeRoleFromUser({
            agent,
            user,
            role: Role.ADMIN,
        }),
    );

    user = buildUser(user, events);
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
