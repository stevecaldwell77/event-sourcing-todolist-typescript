import { EntityEvent } from 'src/entities/entity-event';
import { TodoList } from 'src/entities/todo-list';
import { User } from 'src/entities/user';
import { Agent } from 'src/entities/agent';

export type BuildEventsBasedEntity<K> = {
    (agent: Agent, prev: K | undefined, events: EntityEvent[]): K;
};

export type GetSourceData<K> = {
    (entityId: string): Promise<{ snapshot?: K; events: EntityEvent[] }>;
};

export type GetUserSourceData = GetSourceData<User>;

export type GetTodoListSourceData = GetSourceData<TodoList>;