import { GetEvents, SaveEvents } from 'src/use-cases/types';

export interface EventGateway {
    getEvents: GetEvents;
    saveEvents: SaveEvents;
}
