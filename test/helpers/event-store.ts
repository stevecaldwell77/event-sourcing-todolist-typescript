import EventStoreInMemory from 'src/event-management/event-store-in-memory';
import EventStore from 'src/event-management/event-store';
import { DomainEvent } from 'src/events/domain-event';
import { coerceToEvent } from 'src/events/event-mapper';

const createEventStore = (): EventStore<DomainEvent> =>
    new EventStoreInMemory({
        coerceToEvent: coerceToEvent,
    });

export default createEventStore;
