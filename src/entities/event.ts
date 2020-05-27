import { v4 as uuid } from 'uuid';
import { EntityType, EventName } from './enums';

export interface EntityEvent {
    readonly eventId: string;
    readonly eventTimestamp: number;
    readonly eventName: EventName;
    readonly eventRevision: number;
    readonly entity: EntityType;
    readonly entityId: string;
    readonly eventUserId: string;
}

export const makeEvent = (params: {
    eventId?: string;
    eventTimestamp?: number;
    eventName: EventName;
    eventRevision: number;
    entity: EntityType;
    entityId: string;
    eventUserId: string;
}): EntityEvent => ({
    ...params,
    eventId: params.eventId || uuid(),
    eventTimestamp: params.eventTimestamp || Date.now(),
});
