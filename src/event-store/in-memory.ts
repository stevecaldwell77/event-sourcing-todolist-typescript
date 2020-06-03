import EventGatewayInMemory from 'src/gateways/event/in-memory';
import SnapshotGatewayInMemory from 'src/gateways/snapshot/in-memory';
import EventStore from './event-store';

class EventStoreInMemory extends EventStore {
    constructor() {
        super({
            eventGateway: new EventGatewayInMemory(),
            snapshotGateway: new SnapshotGatewayInMemory(),
        });
    }
}

export default EventStoreInMemory;
