import assert from 'assert';
import autoBind from 'auto-bind';
import { assert as assertIs } from '@sindresorhus/is/dist';
import { EventRepository } from './event-repository';
import { IEvent } from './event';

const getEventNumber = (event: unknown): number => {
    assertIs.object(event);
    if (!event.eventNumber) throw new Error('Unexpected, event missing number');
    assertIs.number(event.eventNumber);
    return event.eventNumber;
};

class EventRepositoryInMemory<TEvent extends IEvent>
    implements EventRepository<TEvent> {
    // events format: { [collectionType]: [collectionId]: [{event}, ...]}
    private events: Record<
        string,
        Record<string, Record<string, unknown>[]>
    > = {};

    constructor() {
        autoBind(this);
    }

    saveEvent(event: TEvent): void {
        const { collectionId } = event;
        const collectionType = event.getCollectionType();
        this.events[collectionType] = this.events[collectionType] || {};
        const events = this.events[collectionType][collectionId] || [];

        const lastEvent = events[events.length - 1];
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

        events.push(event.valueOf());
        this.events[collectionType][collectionId] = events;
    }

    async saveEvents(events: TEvent[]): Promise<void> {
        events.forEach((event) => this.saveEvent(event));
    }

    async getEvents(
        collectionType: string,
        collectionId: string,
        startingRevision?: number,
    ): Promise<Record<string, unknown>[]> {
        const allEvents = this.events[collectionType]?.[collectionId] || [];
        return allEvents.filter((event) => {
            return getEventNumber(event) >= (startingRevision || 1);
        });
    }
}

export default EventRepositoryInMemory;
