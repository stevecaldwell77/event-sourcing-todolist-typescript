import { IEvent } from './event';
import EventStore, { MapToEvent } from './event-store';
import EventGatewayInMemory from './event-gateway-in-memory';
import SnapshotGatewayInMemory from './snapshot-gateway-in-memory';

class EventStoreInMemory<TEvent extends IEvent> extends EventStore<TEvent> {
    constructor(params: { mapToEvent: MapToEvent<TEvent> }) {
        super({
            eventGateway: new EventGatewayInMemory<TEvent>(),
            snapshotGateway: new SnapshotGatewayInMemory(),
            mapToEvent: params.mapToEvent,
        });
    }
}

export default EventStoreInMemory;
