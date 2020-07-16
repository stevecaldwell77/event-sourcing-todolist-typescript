import { IEvent, CoerceToEvent } from './event';
import EventService from './event-service';
import EventGatewayInMemory from './event-gateway-in-memory';
import SnapshotGatewayInMemory from './snapshot-gateway-in-memory';

class EventServiceInMemory<TEvent extends IEvent> extends EventService<TEvent> {
    constructor(params: { coerceToEvent: CoerceToEvent<TEvent> }) {
        super({
            eventGateway: new EventGatewayInMemory<TEvent>(),
            snapshotGateway: new SnapshotGatewayInMemory(),
            coerceToEvent: params.coerceToEvent,
        });
    }
}

export default EventServiceInMemory;
