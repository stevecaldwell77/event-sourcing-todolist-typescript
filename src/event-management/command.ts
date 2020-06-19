import { IEvent } from './event';

export interface CreateCommand<TEvent extends IEvent, TAgent, TParams> {
    name: string;
    run: (entityId: string, agent: TAgent, params: TParams) => TEvent[];
}

export interface Command<TEvent extends IEvent, TAgent, TEntity, TParams> {
    name: string;
    run: (entity: TEntity, agent: TAgent, params: TParams) => TEvent[];
}
