// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import getUser from 'src/use-cases/get-user';
import EventStoreInMemory from 'src/event-store/in-memory';
import { systemAgent } from 'src/entities/agent';
import { newUser } from 'src/entities/user';
import getId from 'src/util/get-id';
import createUser from 'src/use-cases/create-user';
import getAdminUser from 'test/helpers/get-admin-user';

const eventStore = new EventStoreInMemory();

test('successful fetch', async (t) => {
    const userId = getId();
    const email = 'jdoe@example.com';
    await createUser({
        getUserSourceData: eventStore.getUserSourceData,
        saveEvents: eventStore.saveEvents,
        agent: systemAgent,
        userId,
        email,
    });

    const result = await getUser({
        getUserSourceData: eventStore.getUserSourceData,
        agent: systemAgent,
        userId,
    });

    t.deepEqual(
        result,
        newUser({
            email,
            userId,
        }),
        'user fetched correctly',
    );
});

test('miss', async (t) => {
    const userId = getId();
    const result = await getUser({
        getUserSourceData: eventStore.getUserSourceData,
        agent: systemAgent,
        userId,
    });
    t.is(result, undefined, 'undefined returned on unknown user');
});

test('authorization', async (t) => {
    const userId = getId();
    const email = 'jdoe@example.com';
    const adminUser = getAdminUser();

    const user = await createUser({
        getUserSourceData: eventStore.getUserSourceData,
        saveEvents: eventStore.saveEvents,
        agent: systemAgent,
        userId,
        email,
    });

    const otherUser = newUser({
        userId: getId(),
        email: 'other@example.com',
    });

    await t.notThrowsAsync(
        () =>
            getUser({
                getUserSourceData: eventStore.getUserSourceData,
                agent: adminUser,
                userId,
            }),
        'admin user can read a user',
    );

    await t.notThrowsAsync(
        () =>
            getUser({
                getUserSourceData: eventStore.getUserSourceData,
                agent: user,
                userId,
            }),
        'non-admin user can read itself',
    );

    await t.throwsAsync(
        () =>
            getUser({
                getUserSourceData: eventStore.getUserSourceData,
                agent: otherUser,
                userId,
            }),
        {
            message: 'NOT ALLOWED: READ_USER',
        },
        'a non-admin user cannot read another user',
    );
});
