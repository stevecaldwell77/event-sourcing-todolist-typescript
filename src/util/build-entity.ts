import { EntityEvent } from 'src/interfaces/entity-event';

interface HasRevision {
    revision: number;
}

const buildEntity = <K extends HasRevision>(
    prev: K | undefined,
    events: EntityEvent[],
    applyEvent: (prev: K | undefined, event: EntityEvent) => K,
): K => {
    const entity = events.reduce(applyEvent, prev);
    if (!entity) throw new Error('Unexpected error');
    const lastEvent = events[events.length - 1];
    entity.revision = lastEvent.eventRevision;
    return entity;
};

export default buildEntity;
