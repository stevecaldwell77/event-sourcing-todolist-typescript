import EventStoreInMemory from 'src/event-management/event-store-in-memory';
import EventStore from 'src/event-management/event-store';
import { TodoListAppEvent } from 'src/events/todolist-app-event';
import { coerceToEvent } from 'src/events/event-mapper';

const createEventStore = (): EventStore<TodoListAppEvent> =>
    new EventStoreInMemory({
        coerceToEvent: coerceToEvent,
    });

export default createEventStore;
