import { EntityEvent } from 'src/entities/entity-event';
import { Agent } from 'src/entities/agent';
import { SaveEvents, BuildEventsBasedEntity } from './types';

export default async <K>(params: {
    isCreateCommand: boolean;
    getEntity: () => Promise<K | undefined>;
    runCommand: () => EntityEvent[];
    saveEvents: SaveEvents;
    buildEntity: BuildEventsBasedEntity<K>;
    agent: Agent;
    label: string;
}): Promise<K> => {
    const entity = await params.getEntity();
    if (params.isCreateCommand && entity) {
        throw new Error(`${params.label}: entity already exists`);
    } else if (!params.isCreateCommand && !entity) {
        throw new Error(`${params.label}: entity does not exist`);
    }

    const events = params.runCommand();
    await params.saveEvents(events);
    return params.buildEntity(entity, events);
};
