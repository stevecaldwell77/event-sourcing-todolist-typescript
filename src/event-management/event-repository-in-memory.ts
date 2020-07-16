import assert from 'assert';
import autoBind from 'auto-bind';
import {
    EventRepository,
    QueryEventsParams,
    queryEventsFilter,
} from './event-repository';
import { IEvent, EventValue, CoerceToEvent } from './event';

const getEventNumber = (event: IEvent | EventValue): number => {
    if (!event.eventNumber) throw new Error('Unexpected, event missing number');
    return event.eventNumber;
};

const filterForCollection = (
    events: EventValue[],
    collectionType: string,
    collectionId: string,
): EventValue[] =>
    events.filter(
        (event) =>
            event.collectionType === collectionType &&
            event.collectionId === collectionId,
    );

const getNextRevision = (events: EventValue[]): number => {
    if (events.length === 0) return 1;
    const lastEvent = events[events.length - 1];
    return getEventNumber(lastEvent) + 1;
};

const assertEventOrder = (event: IEvent, events: EventValue[]): void => {
    assert.strictEqual(
        getEventNumber(event),
        getNextRevision(events),
        'out of order event',
    );
};

class EventRepositoryInMemory<TEvent extends IEvent>
    implements EventRepository<TEvent> {
    coerceToEvent: CoerceToEvent<TEvent>;

    private events: EventValue[] = [];

    constructor(params: { coerceToEvent: CoerceToEvent<TEvent> }) {
        this.coerceToEvent = params.coerceToEvent;
        autoBind(this);
    }

    saveEvent(event: TEvent): void {
        const prevEvents = filterForCollection(
            this.events,
            event.getCollectionType(),
            event.collectionId,
        );
        assertEventOrder(event, prevEvents);
        this.events.push(event.valueOf());
    }

    async saveEvents(events: TEvent[]): Promise<void> {
        events.forEach((event) => this.saveEvent(event));
    }

    async getEvents(
        collectionType: string,
        collectionId: string,
        startingRevision?: number,
    ): Promise<TEvent[]> {
        return filterForCollection(this.events, collectionType, collectionId)
            .map(this.coerceToEvent)
            .filter((event) => {
                return getEventNumber(event) >= (startingRevision || 1);
            });
    }

    async queryEvents(params: QueryEventsParams): Promise<TEvent[]> {
        return queryEventsFilter(this.events.map(this.coerceToEvent), params);
    }
}

export default EventRepositoryInMemory;
