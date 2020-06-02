import { EntityEvent } from 'src/entities/entity-event';
import { Agent } from 'src/entities/agent';
import { EntityType } from 'src/lib/enums';
import { GetSourceData, SaveEvents, BuildEventsBasedEntity } from './types';

const assertNotExists = async <K>(
    getSourceData: GetSourceData<K>,
    entityType: EntityType,
    entityId: string,
) => {
    const { events } = await getSourceData(entityId);
    if (events.length > 0) {
        throw new Error(`${entityType} ${entityId} already exists`);
    }
};

export default async <K>(params: {
    isCreateCommand: boolean;
    getSourceData: GetSourceData<K>;
    runCommand: () => EntityEvent[];
    saveEvents: SaveEvents;
    buildEntity: BuildEventsBasedEntity<K>;
    entityType: EntityType;
    agent: Agent;
    entityId: string;
}): Promise<K> => {
    if (params.isCreateCommand) {
        await assertNotExists<K>(
            params.getSourceData,
            params.entityType,
            params.entityId,
        );
    } else {
        throw new Error(
            'TODO: run-command-and-update needs to be enhanced to handle existing entities',
        );
    }

    const events = params.runCommand();
    await params.saveEvents(events);
    return params.buildEntity(params.agent, undefined, events);
};
