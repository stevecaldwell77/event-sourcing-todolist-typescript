import { DomainEvent, StartingEvent, StartingEventClass } from './domain-event';

interface IEntity {
    revision: number;
}

type DomainEventHandler<TEntity extends IEntity, TPayload> = (
    entity: TEntity,
    event: DomainEvent<TPayload>,
) => TEntity;

type StartingEventHandler<TEntity extends IEntity, TPayload> = (
    event: StartingEvent<TPayload>,
) => TEntity;

const handleInitialEvent = <TEntity extends IEntity, TStartingEventPayload>(
    label: string,
    startingEventClass: StartingEventClass<TStartingEventPayload>,
    startingEventHandler: StartingEventHandler<TEntity, TStartingEventPayload>,
    events: DomainEvent<unknown>[],
): [TEntity, DomainEvent<unknown>[]] => {
    const [initialEvent, ...eventQueue] = events;

    if (!(initialEvent instanceof startingEventClass)) {
        throw new TypeError(
            `Error in building ${label}: previous entity doesn't exist, and first event is not a starting event (${initialEvent.eventName})`,
        );
    }

    const entity = startingEventHandler(initialEvent);
    if (entity.revision !== 1)
        throw new Error(
            `Error in building ${label}: entity has revision of ${entity.revision} after starting event`,
        );
    return [entity, eventQueue];
};

const handleEvent = <T extends IEntity>(
    label: string,
    eventHandler: DomainEventHandler<T, unknown>,
) => (entity: T, event: DomainEvent<unknown>): T => {
    if (!event.eventNumber)
        throw new Error(
            `Error in building ${label}: event found without an eventNumber (${event.eventName})`,
        );

    if (!(event.eventNumber === entity.revision + 1))
        throw new Error(
            `Error in building ${label}: out-of-order event found: entity revision = ${entity.revision}, eventNumber: ${event.eventNumber} (${event.eventName})`,
        );

    const updatedEntity = eventHandler(entity, event);
    updatedEntity.revision = event.eventNumber;

    return updatedEntity;
};

export const buildEntityFromEvents = <
    TEntity extends IEntity,
    TStartingEventPayload
>(
    label: string,
    startingEventClass: StartingEventClass<TStartingEventPayload>,
    startingEventHandler: StartingEventHandler<TEntity, TStartingEventPayload>,
    eventHandler: DomainEventHandler<TEntity, unknown>,
) => (prev: TEntity | undefined, events: DomainEvent<unknown>[]): TEntity => {
    let eventQueue: DomainEvent<unknown>[];
    let entity: TEntity;

    if (prev) {
        entity = prev;
        eventQueue = events;
    } else {
        [entity, eventQueue] = handleInitialEvent(
            label,
            startingEventClass,
            startingEventHandler,
            events,
        );
    }

    return eventQueue.reduce(handleEvent(label, eventHandler), entity);
};
