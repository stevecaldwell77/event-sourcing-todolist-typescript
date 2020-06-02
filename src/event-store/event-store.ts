import autoBind from 'auto-bind';
import { EntityEvent } from 'src/entities/entity-event';
import { User } from 'src/entities/user';
import { EntityType } from 'src/lib/enums';
import { TodoList } from 'src/entities/todo-list';
import { HasRevision } from 'src/entities/has-revision';
import {
    GetTodoListSourceData,
    GetUserSourceData,
    SaveEvents,
} from 'src/use-cases/types';

interface UseCaseMethods {
    getTodoListSourceData: GetTodoListSourceData;
    getUserSourceData: GetUserSourceData;
    saveEvents: SaveEvents;
}

abstract class EventStore implements UseCaseMethods {
    constructor() {
        autoBind(this);
    }

    abstract async saveEvents(events: EntityEvent[]): Promise<void>;

    abstract async getEvents(
        entityType: EntityType,
        entityId: string,
        startingRevision: number,
    ): Promise<EntityEvent[]>;

    abstract async saveTodoListSnapshot(list: TodoList): Promise<void>;

    abstract async getTodoListSnapshot(
        listId: string,
    ): Promise<TodoList | undefined>;

    abstract async saveUserSnapshot(user: User): Promise<void>;

    abstract async getUserSnapshot(userId: string): Promise<User | undefined>;

    async getEntitySourceData<K extends HasRevision>(
        getSnapshot: (entityId: string) => Promise<K | undefined>,
        entityType: EntityType,
        entityId: string,
    ): Promise<{ snapshot?: K; events: EntityEvent[] }> {
        const snapshot = await getSnapshot(entityId);
        const revision = snapshot ? snapshot.revision : 0;
        const events = await this.getEvents(entityType, entityId, revision + 1);
        return { snapshot, events };
    }

    async getUserSourceData(
        userId: string,
    ): Promise<{ snapshot?: User; events: EntityEvent[] }> {
        return this.getEntitySourceData<User>(
            this.getUserSnapshot,
            EntityType.User,
            userId,
        );
    }

    async getTodoListSourceData(
        listId: string,
    ): Promise<{ snapshot?: TodoList; events: EntityEvent[] }> {
        return this.getEntitySourceData<TodoList>(
            this.getTodoListSnapshot,
            EntityType.TodoList,
            listId,
        );
    }
}

export default EventStore;
