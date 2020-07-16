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

export interface QueryEventsParams {
    startTime: number;
    endTime: number;
    collectionType?: string;
    collectionId?: string;
    agentId?: string;
    eventName?: string;
}

export interface QueryEvents<TEvent extends IEvent> {
    (params: QueryEventsParams): Promise<TEvent[]>;
}

export interface EventRepository<TEvent extends IEvent> {
    coerceToEvent: CoerceToEvent<TEvent>;
    getEvents: GetEvents<TEvent>;
    queryEvents: QueryEvents<TEvent>;
    saveEvents: SaveEvents<TEvent>;
}

export const queryEventsFilter = <TEvent extends IEvent>(
    events: TEvent[],
    params: QueryEventsParams,
): TEvent[] =>
    events.filter(
        (event) =>
            event.eventTimestamp >= params.startTime &&
            event.eventTimestamp < params.endTime &&
            (!params.collectionType ||
                event.getCollectionType() === params.collectionType) &&
            (!params.collectionId ||
                event.collectionId === params.collectionId) &&
            (!params.eventName || event.getEventName() === params.eventName) &&
            (!params.agentId || event.agentId === params.agentId),
    );
