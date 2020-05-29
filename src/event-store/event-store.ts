import { EntityEvent } from 'src/entities/entity-event';
import { User } from 'src/entities/user';
import { EntityType } from 'src/lib/enums';
import { TodoList } from 'src/entities/todo-list';

abstract class EventStore {
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

    async getUserSourceData(
        userId: string,
    ): Promise<{ snapshot?: User; events: EntityEvent[] }> {
        const snapshot = await this.getUserSnapshot(userId);
        const revision = snapshot ? snapshot.revision : 0;
        const events = await this.getEvents(
            EntityType.User,
            userId,
            revision + 1,
        );
        return { snapshot, events };
    }
}

export default EventStore;
