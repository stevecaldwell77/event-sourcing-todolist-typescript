import { Type } from 'io-ts';
import { assert } from '@sindresorhus/is/dist';
import { mapOrDie } from 'src/util/io-ts';

type DomainEventParams<TPayload> = {
    schemaVersion: number;
    eventTimestamp: number;
    agentId: string;
    collectionId: string;
    payload: TPayload;
    eventNumber?: number;
};

type StaticDomainEvent<TEvent, TPayload> = {
    new (params: DomainEventParams<TPayload>): TEvent;
    payloadSchema: Type<TPayload>;
};

export abstract class DomainEvent<TPayload> {
    schemaVersion: number;
    eventTimestamp: number;
    agentId: string;
    collectionId: string;
    payload: TPayload;
    eventNumber?: number;
    static eventName: string;
    static collectionType: string;

    constructor(params: DomainEventParams<TPayload>) {
        this.schemaVersion = params.schemaVersion;
        this.eventTimestamp = params.eventTimestamp;
        this.agentId = params.agentId;
        this.collectionId = params.collectionId;
        this.payload = params.payload;
        this.eventNumber = params.eventNumber;
    }

    static map<TPayload, TEvent extends DomainEvent<TPayload>>(
        this: StaticDomainEvent<TEvent, TPayload>,
        input: unknown,
    ): TEvent {
        assert.plainObject(input);
        assert.number(input.schemaVersion);
        assert.number(input.eventTimestamp);
        assert.string(input.agentId);
        assert.string(input.collectionId);
        assert.plainObject(input.payload);
        assert.number(input.eventNumber);
        assert.string(input.eventName);

        const payload = mapOrDie(this.payloadSchema)(input);

        return new this({
            schemaVersion: input.schemaVersion,
            eventTimestamp: input.eventTimestamp,
            agentId: input.agentId,
            collectionId: input.collectionId,
            eventNumber: input.eventNumber,
            payload: payload,
        });
    }

    getEventName(): string {
        const constructor = <typeof DomainEvent>this.constructor;
        return constructor.eventName;
    }

    getCollectionType(): string {
        const constructor = <typeof DomainEvent>this.constructor;
        return constructor.collectionType;
    }
}

export type DomainEventClass<TPayload> = {
    new (params: DomainEventParams<TPayload>): DomainEvent<TPayload>;
};

export type GenericDomainEvent = DomainEvent<unknown>;

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
    EventClass: DomainEventClass<TPayload>,
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
