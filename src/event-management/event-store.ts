import autoBind from 'auto-bind';
import { IEvent, CoerceToEvent } from './event';
import { IEntity } from './entity';
import { EventGateway, GetEvents, SaveEvents } from './event-gateway';
import { SnapshotGateway } from './snapshot-gateway';
import { AssertType } from './assert';

type GetEntitySourceDataOptions = {
    noSnapshot?: boolean;
};

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
        assertEntity: AssertType<TEntity>,
        collectionId: string,
        options?: GetEntitySourceDataOptions,
    ): Promise<{ snapshot?: TEntity; events: TEvent[] }> {
        const noSnapshot = options?.noSnapshot;
        const snapshot = noSnapshot
            ? undefined
            : await this.snapshotGateway.getSnapshot(
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
