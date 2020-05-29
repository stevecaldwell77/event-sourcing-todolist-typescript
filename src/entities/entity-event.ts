import { v4 as uuid } from 'uuid';
import { EntityType, EventName } from 'src/lib/enums';
import { Agent, getAgentId } from 'src/shared/agent';

export interface EntityEvent {
    readonly eventId: string;
    readonly eventTimestamp: number;
    readonly eventName: EventName;
    readonly eventRevision: number;
    readonly entity: EntityType;
    readonly entityId: string;
    readonly agentId: string;
}

export const makeEvent = (params: {
    eventId?: string;
    eventTimestamp?: number;
    eventName: EventName;
    eventRevision: number;
    entity: EntityType;
    entityId: string;
    agent: Agent;
}): EntityEvent => ({
    ...params,
    eventId: params.eventId || uuid(),
    eventTimestamp: params.eventTimestamp || Date.now(),
    agentId: getAgentId(params.agent),
});
