import { Agent } from 'src/entities/agent';
import { GetSourceData, BuildEventsBasedEntity } from './types';

export default async <K>(params: {
    getSourceData: GetSourceData<K>;
    buildEntity: BuildEventsBasedEntity<K>;
    agent: Agent;
    entityId: string;
}): Promise<K | undefined> => {
    const { getSourceData, buildEntity, agent, entityId } = params;
    const { snapshot, events } = await getSourceData(entityId);
    return events.length > 0 ? buildEntity(agent, snapshot, events) : undefined;
};
