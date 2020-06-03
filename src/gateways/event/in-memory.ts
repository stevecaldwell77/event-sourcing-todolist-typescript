import assert from 'assert';
import autoBind from 'auto-bind';
import { EntityType } from 'src/lib/enums';
import { EventGateway } from 'src/gateways/event';
import { EntityEvent } from 'src/entities/entity-event';

class EventGatewayInMemory implements EventGateway {
    private events: Record<string, EntityEvent[]> = {};

    constructor() {
        autoBind(this);
    }

    async saveEvent(event: EntityEvent): Promise<void> {
        const { entityType, entityId } = event;
        const entityKey = `${entityType}#${entityId}`;
        const events = this.events[entityKey] || [];
        const lastEvent = events[events.length - 1];
        const expectedRevision = lastEvent ? lastEvent.eventRevision + 1 : 1;
        assert.strictEqual(
            event.eventRevision,
            expectedRevision,
            'out of order event',
        );

        events.push(event);
        this.events[entityKey] = events;
    }

    async saveEvents(events: EntityEvent[]): Promise<void> {
        events.map((event) => this.saveEvent(event));
    }

    async getEvents(
        entityType: EntityType,
        entityId: string,
        startingRevision = 1,
    ): Promise<EntityEvent[]> {
        const entityKey = `${entityType}#${entityId}`;
        const allEvents = this.events[entityKey] || [];
        return allEvents.filter(
            (event) => event.eventRevision >= startingRevision,
        );
    }
}

export default EventGatewayInMemory;
