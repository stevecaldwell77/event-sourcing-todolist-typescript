import { EventStore } from 'src/interfaces/event-store';
import { User, makeUser } from 'src/entities/user';
import { Agent } from 'src/shared/agent';

export default async (params: {
    eventStore: EventStore;
    agent: Agent;
    userId: string;
}): Promise<User | undefined> => {
    const { userId, eventStore } = params;
    const { snapshot, events } = await eventStore.getUserSourceData(userId);
    return makeUser(snapshot, events);
};
