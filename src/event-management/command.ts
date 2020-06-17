import { DomainEvent } from './domain-event';

export interface CreateCommand<TAgent> {
    name: string;
    run: (
        entityId: string,
        agent: TAgent,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: any,
    ) => DomainEvent<unknown>[];
}

export interface Command<TAgent, TEntity> {
    name: string;
    run: (
        entity: TEntity,
        agent: TAgent,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: any,
    ) => DomainEvent<unknown>[];
}
