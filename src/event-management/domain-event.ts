type DomainEventParams<TPayload> = {
    schemaVersion: number;
    eventTimestamp: number;
    agentId: string;
    collectionId: string;
    payload: TPayload;
    eventNumber?: number;
};

export abstract class DomainEvent<TPayload> {
    schemaVersion: number;
    eventTimestamp: number;
    agentId: string;
    collectionId: string;
    payload: TPayload;
    eventNumber?: number;
    abstract collectionType: string;
    abstract eventName: string;

    constructor(params: DomainEventParams<TPayload>) {
        this.schemaVersion = params.schemaVersion;
        this.eventTimestamp = params.eventTimestamp;
        this.agentId = params.agentId;
        this.collectionId = params.collectionId;
        this.payload = params.payload;
        this.eventNumber = params.eventNumber;
    }
}

export abstract class StartingEvent<TPayload> extends DomainEvent<TPayload> {
    eventNumber = 1;
}

export type DomainEventClass<TPayload> = {
    new (params: DomainEventParams<TPayload>): DomainEvent<TPayload>;
};

export type StartingEventClass<TPayload> = {
    new (params: DomainEventParams<TPayload>): StartingEvent<TPayload>;
};

export const generateDomainEvent = <TAgent, TEntity>(
    schemaVersion: number,
    getAgentId: (agent: TAgent) => string,
    getCollectionId: (entity: TEntity) => string,
    // eslint-disable-next-line unicorn/consistent-function-scoping
) => <TPayload>(EventClass: DomainEventClass<TPayload>) => (
    agent: TAgent,
    entity: TEntity,
    payload: TPayload,
): DomainEvent<TPayload> => {
    const agentId = getAgentId(agent);
    const collectionId = getCollectionId(entity);
    return new EventClass({
        agentId,
        collectionId,
        payload,
        eventTimestamp: Date.now(),
        schemaVersion,
    });
};

export const generateStartingEvent = <TAgent, TPayload>(
    schemaVersion: number,
    getAgentId: (agent: TAgent) => string,
    EventClass: StartingEventClass<TPayload>,
) => (
    agent: TAgent,
    collectionId: string,
    payload: TPayload,
): DomainEvent<TPayload> => {
    const agentId = getAgentId(agent);
    return new EventClass({
        agentId,
        collectionId,
        payload,
        eventTimestamp: Date.now(),
        schemaVersion,
    });
};
