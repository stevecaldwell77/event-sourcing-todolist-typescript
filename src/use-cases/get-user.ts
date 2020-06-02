import { Agent } from 'src/entities/agent';
import { User, buildUser } from 'src/entities/user';
import { GetUserSourceData } from './types';
import getEventBasedEntity from './get-events-based-entity';

export default async (params: {
    getUserSourceData: GetUserSourceData;
    agent: Agent;
    userId: string;
}): Promise<User | undefined> =>
    getEventBasedEntity({
        getSourceData: params.getUserSourceData,
        buildEntity: buildUser,
        agent: params.agent,
        entityId: params.userId,
    });
