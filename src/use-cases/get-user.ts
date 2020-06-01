import EventStore from 'src/event-store/event-store';
import { User, buildUser } from 'src/entities/user';
import { Agent } from 'src/entities/agent';

export default async (params: {
    eventStore: EventStore;
    agent: Agent;
    userId: string;
}): Promise<User | undefined> => {
    const { agent, userId, eventStore } = params;
    const { snapshot, events } = await eventStore.getUserSourceData(userId);
    return events.length > 0 ? buildUser(agent, snapshot, events) : undefined;
};
