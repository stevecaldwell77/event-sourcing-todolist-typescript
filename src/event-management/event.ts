import { v4 as uuid } from 'uuid';
import { assert } from '@sindresorhus/is/dist';

type EventInput<TPayload> = {
    eventId: string;
    schemaVersion: number;
    eventTimestamp: number;
    agentId: string;
    collectionId: string;
    payload: TPayload;
    eventNumber?: number;
};

type EventValue = EventInput<Record<string, unknown>> & {
    eventName: string;
    collectionType: string;
};

type EventStatic<TEvent, TPayload> = {
    new (params: EventInput<TPayload>): TEvent;
    assertPayload: (v: unknown) => asserts v is TPayload;
};

export type IEvent = Event<Record<string, unknown>>;

export type CoerceToEvent<TEvent extends IEvent> = {
    (input: unknown): TEvent;
};

export abstract class Event<TPayload extends Record<string, unknown>> {
    eventId: string;
    schemaVersion: number;
    eventTimestamp: number;
    agentId: string;
    collectionId: string;
    payload: TPayload;
    eventNumber?: number;
    static eventName: string;
    static collectionType: string;

    constructor(params: EventInput<TPayload>) {
        this.eventId = params.eventId;
        this.schemaVersion = params.schemaVersion;
        this.eventTimestamp = params.eventTimestamp;
        this.agentId = params.agentId;
        this.collectionId = params.collectionId;
        this.payload = params.payload;
        this.eventNumber = params.eventNumber;
    }

    static coerce<
        TPayload extends Record<string, unknown>,
        TEvent extends Event<TPayload>
    >(this: EventStatic<TEvent, TPayload>, input: unknown): TEvent {
        assert.plainObject(input);
        assert.string(input.eventId);
        assert.number(input.schemaVersion);
        assert.number(input.eventTimestamp);
        assert.string(input.agentId);
        assert.string(input.collectionId);
        assert.plainObject(input.payload);
        assert.number(input.eventNumber);
        assert.string(input.eventName);

        this.assertPayload(input.payload);

        return new this({
            eventId: input.eventId,
            schemaVersion: input.schemaVersion,
            eventTimestamp: input.eventTimestamp,
            agentId: input.agentId,
            collectionId: input.collectionId,
            eventNumber: input.eventNumber,
            payload: input.payload,
        });
    }

    getEventName(): string {
        const constructor = <typeof Event>this.constructor;
        return constructor.eventName;
    }

    getCollectionType(): string {
        const constructor = <typeof Event>this.constructor;
        return constructor.collectionType;
    }

    valueOf(): EventValue {
        return {
            eventId: this.eventId,
            schemaVersion: this.schemaVersion,
            eventTimestamp: this.eventTimestamp,
            agentId: this.agentId,
            collectionId: this.collectionId,
            payload: this.payload,
            eventNumber: this.eventNumber,
            eventName: this.getEventName(),
            collectionType: this.getCollectionType(),
        };
    }
}

type EventClass<TPayload extends Record<string, unknown>> = {
    new (params: EventInput<TPayload>): Event<TPayload>;
};

export const generateEvent = <TAgent, TEntity>(
    schemaVersion: number,
    getAgentId: (agent: TAgent) => string,
    getCollectionId: (entity: TEntity) => string,
    // eslint-disable-next-line unicorn/consistent-function-scoping
) => <TPayload extends Record<string, unknown>>(
    EventClass: EventClass<TPayload>,
) => (agent: TAgent, entity: TEntity, payload: TPayload): Event<TPayload> => {
    const agentId = getAgentId(agent);
    const collectionId = getCollectionId(entity);
    return new EventClass({
        eventId: uuid(),
        agentId,
        collectionId,
        payload,
        eventTimestamp: Date.now(),
        schemaVersion,
    });
};

export const generateStartingEvent = <
    TAgent,
    TPayload extends Record<string, unknown>
>(
    schemaVersion: number,
    getAgentId: (agent: TAgent) => string,
    EventClass: EventClass<TPayload>,
) => (
    agent: TAgent,
    collectionId: string,
    payload: TPayload,
): Event<TPayload> => {
    const agentId = getAgentId(agent);
    return new EventClass({
        eventId: uuid(),
        agentId,
        collectionId,
        payload,
        eventTimestamp: Date.now(),
        schemaVersion,
    });
};
