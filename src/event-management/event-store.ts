import autoBind from 'auto-bind';
import { IEvent } from './event';

export interface IEntity {
    revision: number;
}

export type AssertEntity<TEntity> = {
    (v: unknown): asserts v is TEntity;
};

export type Coerce<T> = {
    (input: unknown): T;
};

export type CoerceToEvent<TEvent extends IEvent> = Coerce<TEvent>;

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
        assertEntity: AssertEntity<TEntity>,
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
    coerceToEvent: CoerceToEvent<TEvent>;
    getEvents: GetEvents;
    saveEvents: SaveEvents<TEvent>;

    constructor(params: {
        eventGateway: EventGateway<TEvent>;
        snapshotGateway: SnapshotGateway;
        coerceToEvent: CoerceToEvent<TEvent>;
    }) {
        this.eventGateway = params.eventGateway;
        this.snapshotGateway = params.snapshotGateway;
        this.coerceToEvent = params.coerceToEvent;
        this.getEvents = this.eventGateway.getEvents;
        this.saveEvents = this.eventGateway.saveEvents;
        autoBind(this);
    }

    async getEntitySourceData<TEntity extends IEntity>(
        collectionType: string,
        assertEntity: AssertEntity<TEntity>,
        collectionId: string,
    ): Promise<{ snapshot?: TEntity; events: TEvent[] }> {
        const snapshot = await this.snapshotGateway.getSnapshot(
            collectionType,
            assertEntity,
            collectionId,
        );
        const revision = snapshot ? snapshot.revision : 0;
        const rawEvents = await this.getEvents(
            collectionType,
            collectionId,
            revision + 1,
        );
        const events = rawEvents.map(this.coerceToEvent);
        return { snapshot, events };
    }
}

export default EventStore;
