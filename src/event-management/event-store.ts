import autoBind from 'auto-bind';
import { IEvent } from './event';

export interface IEntity {
    revision: number;
}

export interface MapToEntity<TEntity> {
    (input: unknown): TEntity;
}

export interface MapToEvent<TEvent extends IEvent> {
    (input: unknown): TEvent;
}

interface GetEvents {
    (
        collectionType: string,
        collectionId: string,
        startingRevision?: number,
    ): Promise<Record<string, unknown>[]>;
}

type SaveEvents<TEvent extends IEvent> = {
    (events: TEvent[]): Promise<void>;
};

export interface EventGateway<TEvent extends IEvent> {
    getEvents: GetEvents;
    saveEvents: SaveEvents<TEvent>;
}

export interface SnapshotGateway {
    getSnapshot<TEntity>(
        collectionType: string,
        mapToEntity: MapToEntity<TEntity>,
        collectionId: string,
    ): Promise<TEntity | undefined>;
    saveSnapshot<TEntity>(
        collectionType: string,
        collectionId: string,
        entity: TEntity,
    ): Promise<void>;
}

abstract class EventStore<TEvent extends IEvent> {
    eventGateway: EventGateway<TEvent>;
    snapshotGateway: SnapshotGateway;
    mapToEvent: MapToEvent<TEvent>;
    getEvents: GetEvents;
    saveEvents: SaveEvents<TEvent>;

    constructor(params: {
        eventGateway: EventGateway<TEvent>;
        snapshotGateway: SnapshotGateway;
        mapToEvent: MapToEvent<TEvent>;
    }) {
        this.eventGateway = params.eventGateway;
        this.snapshotGateway = params.snapshotGateway;
        this.mapToEvent = params.mapToEvent;
        this.getEvents = this.eventGateway.getEvents;
        this.saveEvents = this.eventGateway.saveEvents;
        autoBind(this);
    }

    async getEntitySourceData<TEntity extends IEntity>(
        collectionType: string,
        mapToEntity: MapToEntity<TEntity>,
        collectionId: string,
    ): Promise<{ snapshot?: TEntity; events: TEvent[] }> {
        const snapshot = await this.snapshotGateway.getSnapshot(
            collectionType,
            mapToEntity,
            collectionId,
        );
        const revision = snapshot ? snapshot.revision : 0;
        const rawEvents = await this.getEvents(
            collectionType,
            collectionId,
            revision + 1,
        );
        const events = rawEvents.map(this.mapToEvent);
        return { snapshot, events };
    }
}

export default EventStore;
