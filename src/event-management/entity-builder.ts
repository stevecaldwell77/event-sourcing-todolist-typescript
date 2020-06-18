export const assertUnknownEvent = (event: never): never => {
    throw new Error(`Unexpected event found: ${JSON.stringify(event)}`);
};

interface IEntity {
    revision: number;
}

interface IEvent {
    getEventName: () => string;
    eventNumber?: number;
}

interface DomainEventHandler<TEntity, TEntityDomainEvent> {
    (entity: TEntity | undefined, event: TEntityDomainEvent): TEntity;
}

const handleDomainEvent = <
    TEntity extends IEntity,
    TDomainEvent extends IEvent
>(
    label: string,
    domainEventHandler: DomainEventHandler<TEntity, TDomainEvent>,
) => (entity: TEntity | undefined, event: TDomainEvent): TEntity => {
    if (!event.eventNumber)
        throw new Error(
            `Error in building ${label}: event found without an eventNumber (${event.getEventName()})`,
        );

    if (!entity && event.eventNumber !== 1)
        throw new Error(
            `Error in building ${label}: previous entity doesn't exist, and event does not have an eventNumber of 1 (${event.getEventName()})`,
        );

    if (entity && event.eventNumber !== entity.revision + 1)
        throw new Error(
            `Error in building ${label}: out-of-order event found: entity revision = ${
                entity.revision
            }, eventNumber: ${event.eventNumber} (${event.getEventName()})`,
        );

    const updatedEntity = domainEventHandler(entity, event);
    updatedEntity.revision = event.eventNumber;

    return updatedEntity;
};

export const entityBuilder = <
    TEntity extends IEntity,
    TDomainEvent extends IEvent
>(params: {
    label: string;
    domainEventHandler: DomainEventHandler<TEntity, TDomainEvent>;
}) => (prev: TEntity | undefined, events: TDomainEvent[]): TEntity => {
    const { label, domainEventHandler } = params;
    const result = events.reduce(
        handleDomainEvent(label, domainEventHandler),
        prev,
    );
    if (!result)
        throw new Error(
            `Error in building ${label}: Unexpected: did not end up with defined entity`,
        );
    return result;
};
