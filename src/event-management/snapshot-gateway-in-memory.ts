import autoBind from 'auto-bind';
import { SnapshotGateway, Coerce } from './event-store';

class SnapshotGatewayInMemory implements SnapshotGateway {
    private records: Record<string, unknown> = {};

    constructor() {
        autoBind(this);
    }

    entityKey(collectionType: string, entityId: string): string {
        return `${collectionType}#${entityId}`;
    }

    async getSnapshot<T>(
        collectionType: string,
        coerceToEntity: Coerce<T>,
        entityId: string,
    ): Promise<T | undefined> {
        const key = this.entityKey(collectionType, entityId);
        const record = this.records[key];
        return record ? coerceToEntity(record) : undefined;
    }

    async saveSnapshot<T>(
        collectionType: string,
        entityId: string,
        entity: T,
    ): Promise<void> {
        const key = this.entityKey(collectionType, entityId);
        this.records[key] = entity;
    }
}

export default SnapshotGatewayInMemory;
