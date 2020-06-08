import { Agent } from 'src/entities/agent';
import {
    GetSourceData,
    BuildEventsBasedEntity,
    AssertReadAuthorized,
} from './types';

export default async <K>(params: {
    getSourceData: GetSourceData<K>;
    buildEntity: BuildEventsBasedEntity<K>;
    assertReadAuthorized: AssertReadAuthorized<K>;
    agent: Agent;
    entityId: string;
}): Promise<K | undefined> => {
    const {
        getSourceData,
        buildEntity,
        agent,
        entityId,
        assertReadAuthorized,
    } = params;
    const { snapshot, events } = await getSourceData(entityId);
    if (events.length === 0) return undefined;

    const entity = buildEntity(snapshot, events);
    assertReadAuthorized(agent, entity);

    return entity;
};
