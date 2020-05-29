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

interface HasRevision {
    revision: number;
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

export type EventHandler<K> = (prev: K | undefined, event: EntityEvent) => K;

export type EventMapper<K> = Partial<Record<EventName, EventHandler<K>>>;

const applyEvent = <K>(eventMapper: EventMapper<K>) => (
    prev: K | undefined,
    event: EntityEvent,
): K => {
    const handler = eventMapper[event.eventName];
    if (!handler) throw new Error(`Unknown event ${event.eventName}`);
    return handler(prev, event);
};

export const buildEntityFromEvents = <K extends HasRevision>(
    eventMapper: EventMapper<K>,
) => (prev: K | undefined, events: EntityEvent[]): K => {
    const entity = events.reduce(applyEvent(eventMapper), prev);
    if (!entity) throw new Error('Unexpected error');
    const lastEvent = events[events.length - 1];
    entity.revision = lastEvent.eventRevision;
    return entity;
};