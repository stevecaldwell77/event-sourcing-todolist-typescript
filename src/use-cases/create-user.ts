import {
    Permission,
    assertRequestorHasPermission,
} from 'src/shared/authorization';
import { EventStore } from 'src/interfaces/event-store';
import { User, buildUser, commands } from 'src/entities/user';
import { Agent } from 'src/shared/agent';

const assertNotExists = async (eventStore: EventStore, userId: string) => {
    const { events } = await eventStore.getUserSourceData(userId);
    if (events.length > 0) {
        throw new Error(`User ${userId} already exists`);
    }
};

export default async (params: {
    eventStore: EventStore;
    agent: Agent;
    userId: string;
    email: string;
}): Promise<User> => {
    const { eventStore, agent, userId, email } = params;
    assertRequestorHasPermission(agent, Permission.CREATE_USER);
    await assertNotExists(eventStore, userId);

    const events = commands.createUser({
        agent,
        userId,
        email,
    });

    await eventStore.saveEvents(events);

    return buildUser(undefined, events);
};
