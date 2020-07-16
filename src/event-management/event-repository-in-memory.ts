import assert from 'assert';
import autoBind from 'auto-bind';
import { assert as assertIs } from '@sindresorhus/is/dist';
import { EventRepository } from './event-repository';
import { IEvent, EventValue, CoerceToEvent } from './event';

const getEventNumber = (event: unknown): number => {
    assertIs.object(event);
    if (!event.eventNumber) throw new Error('Unexpected, event missing number');
    assertIs.number(event.eventNumber);
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

class EventRepositoryInMemory<TEvent extends IEvent>
    implements EventRepository<TEvent> {
    coerceToEvent: CoerceToEvent<TEvent>;

    private events: EventValue[] = [];

    constructor(params: { coerceToEvent: CoerceToEvent<TEvent> }) {
        this.coerceToEvent = params.coerceToEvent;
        autoBind(this);
    }

    saveEvent(event: TEvent): void {
        const { collectionId } = event;
        const collectionType = event.getCollectionType();
        const prevEvents = filterForCollection(
            this.events,
            collectionType,
            collectionId,
        );

        const lastEvent = prevEvents[prevEvents.length - 1];
        let expectedRevision: number;
        if (lastEvent) {
            expectedRevision = getEventNumber(lastEvent) + 1;
        } else {
            expectedRevision = 1;
        }

        assert.strictEqual(
            getEventNumber(event),
            expectedRevision,
            'out of order event',
        );

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
            .filter((event) => {
                return getEventNumber(event) >= (startingRevision || 1);
            })
            .map(this.coerceToEvent);
    }
}

export default EventRepositoryInMemory;
