import { EntityType, EventName } from 'src/lib/enums';

export interface EntityEvent {
    readonly eventId: string;
    readonly eventTimestamp: number;
    readonly eventName: EventName;
    readonly eventRevision: number;
    readonly entity: EntityType;
    readonly entityId: string;
    readonly eventUserId: string;
}
