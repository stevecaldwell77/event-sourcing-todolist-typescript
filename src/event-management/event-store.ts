import autoBind from 'auto-bind';
import { EntityEvent } from 'src/entities/entity-event';
import { EntityType } from 'src/lib/enums';
import { MapToEntity, HasRevision } from 'src/entities/types';
import { GetEvents, SaveEvents } from 'src/use-cases/types';
import { SnapshotGateway } from 'src/gateways/snapshot';
import { EventGateway } from '../gateways/event';

abstract class EventStore {
    eventGateway: EventGateway;
    snapshotGateway: SnapshotGateway;
    getEvents: GetEvents;
    saveEvents: SaveEvents;

    constructor(params: {
        eventGateway: EventGateway;
        snapshotGateway: SnapshotGateway;
    }) {
        this.eventGateway = params.eventGateway;
        this.snapshotGateway = params.snapshotGateway;
        this.getEvents = this.eventGateway.getEvents;
        this.saveEvents = this.eventGateway.saveEvents;
        autoBind(this);
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
