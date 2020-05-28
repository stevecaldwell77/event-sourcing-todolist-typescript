import EventStore from 'src/event-store/event-store';
import { User, buildUser } from 'src/entities/user';
import { Agent } from 'src/shared/agent';

export default async (params: {
    eventStore: EventStore;
    agent: Agent;
    userId: string;
}): Promise<User | undefined> => {
    const { userId, eventStore } = params;
    const { snapshot, events } = await eventStore.getUserSourceData(userId);
    return events.length > 0 ? buildUser(snapshot, events) : undefined;
};
