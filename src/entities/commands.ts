import { IEvent } from 'src/event-management/event';

export interface CreateCommand<TAgent, TParams, TEvent extends IEvent> {
    name: string;
    run: (entityId: string, agent: TAgent, params: TParams) => TEvent[];
}

export interface Command<TAgent, TEntity, TParams, TEvent> {
    name: string;
    run: (entity: TEntity, agent: TAgent, params: TParams) => TEvent[];
}
