import { EntityEvent } from 'src/entities/entity-event';
import { TodoList } from 'src/entities/todo-list';
import { User } from 'src/entities/user';
import { Agent } from 'src/entities/agent';

export type BuildEventsBasedEntity<K> = {
    (prev: K | undefined, events: EntityEvent[]): K;
};

export type SaveEvents = {
    (events: EntityEvent[]): Promise<void>;
};

export type GetSourceData<K> = {
    (entityId: string): Promise<{ snapshot?: K; events: EntityEvent[] }>;
};

export type AssertReadAuthorized<K> = (agent: Agent, entity: K) => void;

export type GetTodoListSourceData = GetSourceData<TodoList>;
export type GetUserSourceData = GetSourceData<User>;
