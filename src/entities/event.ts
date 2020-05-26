import { v4 as uuid } from 'uuid';
import { EntityType } from './enums';

export class Event {
    readonly eventId: string;
    readonly eventTimestamp: number;
    readonly eventName: string;
    readonly entity: EntityType;
    readonly entityId: string;
    readonly userId: string;

    constructor(params: {
        eventName: string;
        entity: EntityType;
        entityId: string;
        userId: string;
    }) {
        this.eventId = uuid();
        this.eventTimestamp = Date.now();
        this.eventName = params.eventName;
        this.entity = params.entity;
        this.entityId = params.entityId;
        this.userId = params.userId;
    }
}
