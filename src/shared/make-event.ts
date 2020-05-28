import { v4 as uuid } from 'uuid';
import { EntityType, EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { Agent, getAgentId } from 'src/shared/agent';

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
