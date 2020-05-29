import assert from 'assert';
import { EntityEvent } from 'src/entities/entity-event';
import { EntityType } from 'src/lib/enums';
import { User } from 'src/entities/user';
import { TodoList } from 'src/entities/todo-list';
import EventStore from './event-store';

class EventStoreInMemory extends EventStore {
    private events: Record<string, EntityEvent[]> = {};
    private users: Record<string, User> = {};
    private todoLists: Record<string, TodoList> = {};

    async saveEvent(event: EntityEvent): Promise<void> {
        const { entityType, entityId } = event;
        const entityKey = `${entityType}#${entityId}`;
        const events = this.events[entityKey] || [];
        const lastEvent = events[events.length - 1];
        const expectedRevision = lastEvent ? lastEvent.eventRevision + 1 : 1;
        assert.strictEqual(
            event.eventRevision,
            expectedRevision,
            'out of order event',
        );

        events.push(event);
        this.events[entityKey] = events;
    }

    async saveEvents(events: EntityEvent[]): Promise<void> {
        events.map((event) => this.saveEvent(event));
    }

    async getEvents(
        entityType: EntityType,
        entityId: string,
        startingRevision = 1,
    ): Promise<EntityEvent[]> {
        const entityKey = `${entityType}#${entityId}`;
        const allEvents = this.events[entityKey] || [];
        return allEvents.filter(
            (event) => event.eventRevision >= startingRevision,
        );
    }

    async saveTodoListSnapshot(list: TodoList): Promise<void> {
        this.todoLists[list.listId] = list;
    }

    async getTodoListSnapshot(listId: string): Promise<TodoList | undefined> {
        return this.todoLists[listId];
    }

    async saveUserSnapshot(user: User): Promise<void> {
        this.users[user.userId] = user;
    }

    async getUserSnapshot(userId: string): Promise<User | undefined> {
        return this.users[userId];
    }
}

export default EventStoreInMemory;
