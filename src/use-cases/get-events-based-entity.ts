import { Agent } from 'src/entities/agent';
import { Authorization } from 'src/entities/authorization';
import { GetSourceData, BuildEventsBasedEntity } from './types';

export default async <K>(params: {
    getSourceData: GetSourceData<K>;
    buildEntity: BuildEventsBasedEntity<K>;
    authorization: Authorization<K>;
    agent: Agent;
    entityId: string;
}): Promise<K | undefined> => {
    const {
        getSourceData,
        buildEntity,
        agent,
        entityId,
        authorization,
    } = params;
    const { snapshot, events } = await getSourceData(entityId);
    if (events.length === 0) return undefined;

    const entity = buildEntity(snapshot, events);
    authorization.assertRead(agent, entity);

    return entity;
};
