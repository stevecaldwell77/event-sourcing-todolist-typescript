import autoBind from 'auto-bind';
import { IEvent, CoerceToEvent } from './event';
import { IEntity } from './entity';
import { EventRepository, GetEvents, SaveEvents } from './event-repository';
import { SnapshotRepository } from './snapshot-repository';
import { AssertType } from './assert';

type GetEntitySourceDataOptions = {
    noSnapshot?: boolean;
};

abstract class EventService<TEvent extends IEvent> {
    eventRepository: EventRepository<TEvent>;
    snapshotRepository: SnapshotRepository;
    coerceToEvent: CoerceToEvent<TEvent>;
    getEvents: GetEvents;
    saveEvents: SaveEvents<TEvent>;

    constructor(params: {
        eventRepository: EventRepository<TEvent>;
        snapshotRepository: SnapshotRepository;
        coerceToEvent: CoerceToEvent<TEvent>;
    }) {
        this.eventRepository = params.eventRepository;
        this.snapshotRepository = params.snapshotRepository;
        this.coerceToEvent = params.coerceToEvent;
        this.getEvents = this.eventRepository.getEvents;
        this.saveEvents = this.eventRepository.saveEvents;
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
            : await this.snapshotRepository.getSnapshot(
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

export default EventService;
