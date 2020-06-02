// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import EventStoreInMemory from 'src/event-store/in-memory';
import createUser from 'src/use-cases/create-user';
import getId from 'src/util/get-id';
import { systemAgent } from 'src/entities/agent';
import { EntityType } from 'src/lib/enums';
import { isEventUserCreated } from 'src/entities/user/events/user-created';

const eventStore = new EventStoreInMemory();

test('successful creation', async (t) => {
    const userId = getId();
    const email = 'jdoe@example.com';
    const getEvents = () => eventStore.getEvents(EntityType.User, userId);

    t.deepEqual(await getEvents(), [], 'no events initially');

    await createUser({
        getUserSourceData: eventStore.getUserSourceData,
        saveEvents: eventStore.saveEvents,
        agent: systemAgent,
        email,
        userId,
    });

    const events = await getEvents();
    t.is(events.length, 1, 'one event saved');
    t.true(isEventUserCreated(events[0]), 'UserCreated event saved');
});

test('error on duplicate', async (t) => {
    const userId = getId();
    const email = 'jdoe@example.com';
    const createParams = {
        getUserSourceData: eventStore.getUserSourceData,
        saveEvents: eventStore.saveEvents,
        agent: systemAgent,
        email,
        userId,
    };

    await createUser(createParams);

    await t.throwsAsync(
        () => createUser(createParams),
        { message: /createUser: entity already exists/ },
        'error thrown when trying to create duplicate user',
    );
});
