import autoBind from 'auto-bind';
import { EntityEvent } from 'src/entities/entity-event';
import { EntityType } from 'src/lib/enums';
import { MapToEntity, HasRevision } from 'src/entities/types';
import { SnapshotGateway } from 'src/gateways/snapshot';
import { EventGateway } from '../gateways/event';

abstract class EventStore {
    public eventGateway: EventGateway;
    public snapshotGateway: SnapshotGateway;

    constructor(params: {
        eventGateway: EventGateway;
        snapshotGateway: SnapshotGateway;
    }) {
        this.eventGateway = params.eventGateway;
        this.snapshotGateway = params.snapshotGateway;
        autoBind(this);
    }

    async saveEvents(events: EntityEvent[]): Promise<void> {
        return this.eventGateway.saveEvents(events);
    }

    async getEvents(
        entityType: EntityType,
        entityId: string,
        startingRevision = 1,
    ): Promise<EntityEvent[]> {
        return this.eventGateway.getEvents(
            entityType,
            entityId,
            startingRevision,
        );
    }

    async getEntitySourceData<T extends HasRevision>(
        entityType: EntityType,
        mapToEntity: MapToEntity<T>,
        entityId: string,
    ): Promise<{ snapshot?: T; events: EntityEvent[] }> {
        const snapshot = await this.snapshotGateway.getSnapshot(
            entityType,
            mapToEntity,
            entityId,
        );
        const revision = snapshot ? snapshot.revision : 0;
        const events = await this.getEvents(entityType, entityId, revision + 1);
        return { snapshot, events };
    }
}

export default EventStore;
