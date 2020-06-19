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

interface EventHandler<TEntity, TEntityEvent> {
    (entity: TEntity | undefined, event: TEntityEvent): TEntity;
}

const handleEvent = <TEntity extends IEntity, TEvent extends IEvent>(
    label: string,
    eventHandler: EventHandler<TEntity, TEvent>,
) => (entity: TEntity | undefined, event: TEvent): TEntity => {
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

    const updatedEntity = eventHandler(entity, event);
    updatedEntity.revision = event.eventNumber;

    return updatedEntity;
};

export const entityBuilder = <
    TEntity extends IEntity,
    TEvent extends IEvent
>(params: {
    label: string;
    eventHandler: EventHandler<TEntity, TEvent>;
}) => (prev: TEntity | undefined, events: TEvent[]): TEntity => {
    const { label, eventHandler } = params;
    const result = events.reduce(handleEvent(label, eventHandler), prev);
    if (!result)
        throw new Error(
            `Error in building ${label}: Unexpected: did not end up with defined entity`,
        );
    return result;
};
