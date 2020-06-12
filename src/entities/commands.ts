import { Agent } from 'src/entities/agent';
import { EntityEvent } from 'src/entities/entity-event';

export interface CreateCommand<T, U> {
    name: string;
    run: (entityId: string, agent: Agent, params: U) => EntityEvent[];
}

export interface Command<T, V> {
    name: string;
    run: (entity: T, agent: Agent, params: V) => EntityEvent[];
}
