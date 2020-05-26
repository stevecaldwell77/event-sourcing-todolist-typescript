export type EntityName = 'TodoList';

export interface EventUser {
    id: string;
}

export interface Event {
    readonly eventId: string;
    readonly eventTimestamp: number;
    readonly eventName: string;
    readonly entity: EntityName;
    readonly entityId: string;
    readonly user: EventUser;
}

export const createEvent = (params: {
    eventName: string;
    entity: EntityName;
    entityId: string;
    user: EventUser;
    payload: Record<string, unknown>;
}): Event => ({
    eventId: 'todo',
    eventTimestamp: Date.now(),
    ...params,
});
