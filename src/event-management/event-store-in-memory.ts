import EventStore from './event-store';
import EventGatewayInMemory from './event-gateway-in-memory';
import SnapshotGatewayInMemory from './snapshot-gateway-in-memory';

class EventStoreInMemory extends EventStore {
    constructor() {
        super({
            eventGateway: new EventGatewayInMemory(),
            snapshotGateway: new SnapshotGatewayInMemory(),
        });
    }
}

export default EventStoreInMemory;
