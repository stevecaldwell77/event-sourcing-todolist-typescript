import { EntityType } from 'src/lib/enums';
import { EntityEvent } from 'src/entities/entity-event';
import { SaveEvents } from 'src/use-cases/types';

export interface EventGateway {
    getEvents(
        entityType: EntityType,
        entityId: string,
        startingRevision: number,
    ): Promise<EntityEvent[]>;
    saveEvents: SaveEvents;
}
