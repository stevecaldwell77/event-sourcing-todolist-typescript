import EventStoreInMemory from 'src/event-management/event-store-in-memory';
import EventStore from 'src/event-management/event-store';
import { AppEvent } from 'src/events/app-event';
import { coerceToEvent } from 'src/events/event-mapper';

const createEventStore = (): EventStore<AppEvent> =>
    new EventStoreInMemory({
        coerceToEvent: coerceToEvent,
    });

export default createEventStore;
