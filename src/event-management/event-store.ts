import autoBind from 'auto-bind';
import { GenericDomainEvent } from './domain-event';

interface IEntity {
    revision: number;
}

export interface MapToEntity<TEntity> {
    (input: unknown): TEntity;
}

interface GetEvents {
    (
        collectionType: string,
        collectionId: string,
        startingRevision?: number,
    ): Promise<GenericDomainEvent[]>;
}

type SaveEvents = {
    (events: GenericDomainEvent[]): Promise<void>;
};

export interface EventGateway {
    getEvents: GetEvents;
    saveEvents: SaveEvents;
}

export interface SnapshotGateway {
    getSnapshot<T>(
        collectionType: string,
        mapToEntity: MapToEntity<T>,
        collectionId: string,
    ): Promise<T | undefined>;
    saveSnapshot<T>(
        collectionType: string,
        collectionId: string,
        entity: T,
    ): Promise<void>;
}

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

    async getEntitySourceData<TEntity extends IEntity>(
        collectionType: string,
        mapToEntity: MapToEntity<TEntity>,
        collectionId: string,
    ): Promise<{ snapshot?: TEntity; events: GenericDomainEvent[] }> {
        const snapshot = await this.snapshotGateway.getSnapshot(
            collectionType,
            mapToEntity,
            collectionId,
        );
        const revision = snapshot ? snapshot.revision : 0;
        const events = await this.getEvents(
            collectionType,
            collectionId,
            revision + 1,
        );
        return { snapshot, events };
    }
}

export default EventStore;
