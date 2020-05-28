import { EntityEvent } from 'src/interfaces/entity-event';
import { EntityType } from 'src/lib/enums';
import { User } from 'src/entities/user';
import EventStore from './event-store';

class EventStoreInMemory extends EventStore {
    private events: Record<string, EntityEvent[]> = {};
    private users: Record<string, User> = {};

    async saveEvent(event: EntityEvent): Promise<void> {
        const { entity, entityId } = event;
        const entityKey = `${entity}#${entityId}`;
        this.events[entityKey] = this.events[entityKey] || [];
        this.events[entityKey].push(event);
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

    async saveUserSnapshot(user: User): Promise<void> {
        this.users[user.userId] = user;
    }

    async getUserSnapshot(userId: string): Promise<User | undefined> {
        return this.users[userId];
    }
}

export default EventStoreInMemory;