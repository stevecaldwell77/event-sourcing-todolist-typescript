import autoBind from 'auto-bind';
import { SnapshotGateway } from 'src/gateways/snapshot';
import { EntityType } from 'src/lib/enums';
import { MapToEntity } from 'src/entities/types';

class SnapshotGatewayInMemory implements SnapshotGateway {
    private records: Record<string, unknown> = {};

    constructor() {
        autoBind(this);
    }

    entityKey(entityType: EntityType, entityId: string): string {
        return `${entityType}#${entityId}`;
    }

    async getSnapshot<T>(
        entityType: EntityType,
        mapToEntity: MapToEntity<T>,
        entityId: string,
    ): Promise<T | undefined> {
        const key = this.entityKey(entityType, entityId);
        const record = this.records[key];
        return record ? mapToEntity(record) : undefined;
    }

    async saveSnapshot<T>(
        entityType: EntityType,
        entityId: string,
        entity: T,
    ): Promise<void> {
        const key = this.entityKey(entityType, entityId);
        this.records[key] = entity;
    }
}

export default SnapshotGatewayInMemory;
