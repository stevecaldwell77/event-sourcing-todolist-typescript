import { IEvent } from './event';
import EventStore, { CoerceToEvent } from './event-store';
import EventGatewayInMemory from './event-gateway-in-memory';
import SnapshotGatewayInMemory from './snapshot-gateway-in-memory';

class EventStoreInMemory<TEvent extends IEvent> extends EventStore<TEvent> {
    constructor(params: { coerceToEvent: CoerceToEvent<TEvent> }) {
        super({
            eventGateway: new EventGatewayInMemory<TEvent>(),
            snapshotGateway: new SnapshotGatewayInMemory(),
            coerceToEvent: params.coerceToEvent,
        });
    }
}

export default EventStoreInMemory;
