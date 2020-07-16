import { IEvent } from './event';

export interface GetEvents {
    (
        collectionType: string,
        collectionId: string,
        startingRevision?: number,
    ): Promise<Record<string, unknown>[]>;
}

export type SaveEvents<TEvent extends IEvent> = {
    (events: TEvent[]): Promise<void>;
};

export interface EventRepository<TEvent extends IEvent> {
    getEvents: GetEvents;
    saveEvents: SaveEvents<TEvent>;
}
