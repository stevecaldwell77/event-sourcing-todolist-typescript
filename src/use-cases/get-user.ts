import { Agent } from 'src/entities/agent';
import { User, buildUser } from 'src/entities/user';
import { GetUserSourceData } from './types';

export default async (params: {
    getUserSourceData: GetUserSourceData;
    agent: Agent;
    userId: string;
}): Promise<User | undefined> => {
    const { getUserSourceData, agent, userId } = params;
    const { snapshot, events } = await getUserSourceData(userId);
    return events.length > 0 ? buildUser(agent, snapshot, events) : undefined;
};
