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
import { SnapshotGateway } from './snapshot-gateway';
import { EventGateway } from './event-gateway';

interface EventStoreInterface {
    getTodoListSourceData: GetTodoListSourceData;
    getUserSourceData: GetUserSourceData;
    saveEvents: SaveEvents;
}

abstract class EventStore implements EventStoreInterface {
    public eventGateway: EventGateway;
    public snapshotGateway: SnapshotGateway;

    constructor(params: {
        eventGateway: EventGateway;
        snapshotGateway: SnapshotGateway;
    }) {
        this.eventGateway = params.eventGateway;
        this.snapshotGateway = params.snapshotGateway;
        autoBind(this);
    }

    async saveEvents(events: EntityEvent[]): Promise<void> {
        return this.eventGateway.saveEvents(events);
    }

    async getEvents(
        entityType: EntityType,
        entityId: string,
        startingRevision = 1,
    ): Promise<EntityEvent[]> {
        return this.eventGateway.getEvents(
            entityType,
            entityId,
            startingRevision,
        );
    }

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
            this.snapshotGateway.getUserSnapshot,
            EntityType.User,
            userId,
        );
    }

    async getTodoListSourceData(
        listId: string,
    ): Promise<{ snapshot?: TodoList; events: EntityEvent[] }> {
        return this.getEntitySourceData<TodoList>(
            this.snapshotGateway.getTodoListSnapshot,
            EntityType.TodoList,
            listId,
        );
    }
}

export default EventStore;
