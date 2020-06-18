import assert from 'assert';
import autoBind from 'auto-bind';
import { EventGateway } from './event-store';
import { GenericDomainEvent } from './domain-event';

class EventGatewayInMemory implements EventGateway {
    private events: Record<string, GenericDomainEvent[]> = {};

    constructor() {
        autoBind(this);
    }

    async saveEvent(event: GenericDomainEvent): Promise<void> {
        const { collectionId } = event;
        const collectionType = event.getCollectionType();
        const entityKey = `${collectionType}#${collectionId}`;
        const events = this.events[entityKey] || [];
        const lastEvent = events[events.length - 1];
        let expectedRevision: number;
        if (lastEvent) {
            if (!lastEvent.eventNumber)
                throw new Error('Unexpected, saved event missing number');
            expectedRevision = lastEvent.eventNumber + 1;
        } else {
            expectedRevision = 1;
        }

        assert.strictEqual(
            event.eventNumber,
            expectedRevision,
            'out of order event',
        );

        events.push(event);
        this.events[entityKey] = events;
    }

    async saveEvents(events: GenericDomainEvent[]): Promise<void> {
        events.map((event) => this.saveEvent(event));
    }

    async getEvents(
        collectionType: string,
        collectionId: string,
        startingRevision = 1,
    ): Promise<GenericDomainEvent[]> {
        const entityKey = `${collectionType}#${collectionId}`;
        const allEvents = this.events[entityKey] || [];
        return allEvents.filter((event) => {
            if (!event.eventNumber)
                throw new Error('Unexpected, saved event missing number');
            return event.eventNumber >= startingRevision;
        });
    }
}

export default EventGatewayInMemory;
