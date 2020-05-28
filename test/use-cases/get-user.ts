// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import getUser from 'src/use-cases/get-user';
import EventStoreInMemory from 'src/event-store/in-memory';
import initializeUser from 'test/helpers/initialize-user';
import { systemAgent } from 'src/shared/agent';
import { newUser } from 'src/entities/user';
import getId from 'src/util/get-id';

const eventStore = new EventStoreInMemory();

test('successful fetch', async (t) => {
    const { events, userId, email } = initializeUser();
    await eventStore.saveEvents(events);
    const result = await getUser({
        eventStore,
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
        eventStore,
        agent: systemAgent,
        userId,
    });
    t.is(result, undefined, 'undefined returned on unknown user');
});
