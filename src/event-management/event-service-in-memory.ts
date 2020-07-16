import { IEvent, CoerceToEvent } from './event';
import EventService from './event-service';
import EventRepositoryInMemory from './event-repository-in-memory';
import SnapshotRepositoryInMemory from './snapshot-repository-in-memory';

class EventServiceInMemory<TEvent extends IEvent> extends EventService<TEvent> {
    constructor(params: { coerceToEvent: CoerceToEvent<TEvent> }) {
        super({
            eventRepository: new EventRepositoryInMemory<TEvent>(),
            snapshotRepository: new SnapshotRepositoryInMemory(),
            coerceToEvent: params.coerceToEvent,
        });
    }
}

export default EventServiceInMemory;
