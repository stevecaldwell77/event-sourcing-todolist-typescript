import { User, buildUser, commands } from 'src/entities/user';
import { Agent } from 'src/entities/agent';
import { SaveEvents, GetUserSourceData } from './types';

const assertNotExists = async (
    getUserSourceData: GetUserSourceData,
    userId: string,
) => {
    const { events } = await getUserSourceData(userId);
    if (events.length > 0) {
        throw new Error(`User ${userId} already exists`);
    }
};

export default async (params: {
    getUserSourceData: GetUserSourceData;
    saveEvents: SaveEvents;
    agent: Agent;
    userId: string;
    email: string;
}): Promise<User> => {
    const { getUserSourceData, saveEvents, agent, userId, email } = params;
    await assertNotExists(getUserSourceData, userId);

    const events = commands.createUser({
        agent,
        userId,
        email,
    });

    await saveEvents(events);

    return buildUser(agent, undefined, events);
};
