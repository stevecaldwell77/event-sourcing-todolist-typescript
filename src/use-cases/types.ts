import { EntityType } from 'src/lib/enums';
import { EntityEvent } from 'src/entities/entity-event';
import { TodoList } from 'src/entities/todo-list';
import { User } from 'src/entities/user';

export type BuildEventsBasedEntity<K> = {
    (prev: K | undefined, events: EntityEvent[]): K;
};

export interface GetEvents {
    (
        entityType: EntityType,
        entityId: string,
        startingRevision?: number,
    ): Promise<EntityEvent[]>;
}

export type SaveEvents = {
    (events: EntityEvent[]): Promise<void>;
};

export type GetSourceData<K> = {
    (entityId: string): Promise<{ snapshot?: K; events: EntityEvent[] }>;
};

export type GetTodoListSourceData = GetSourceData<TodoList>;
export type GetUserSourceData = GetSourceData<User>;
