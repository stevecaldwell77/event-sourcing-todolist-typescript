import { IEvent, CoerceToEvent } from './event';

export interface GetEvents<TEvent extends IEvent> {
    (
        collectionType: string,
        collectionId: string,
        startingRevision?: number,
    ): Promise<TEvent[]>;
}

export type SaveEvents<TEvent extends IEvent> = {
    (events: TEvent[]): Promise<void>;
};

export interface EventRepository<TEvent extends IEvent> {
    coerceToEvent: CoerceToEvent<TEvent>;
    getEvents: GetEvents<TEvent>;
    saveEvents: SaveEvents<TEvent>;
}
