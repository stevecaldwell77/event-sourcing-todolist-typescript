import autoBind from 'auto-bind';
import { AssertType } from './assert';
import { SnapshotRepository } from './snapshot-repository';

class SnapshotRepositoryInMemory implements SnapshotRepository {
    private records: Record<string, unknown> = {};

    constructor() {
        autoBind(this);
    }

    entityKey(collectionType: string, entityId: string): string {
        return `${collectionType}#${entityId}`;
    }

    async getSnapshot<T>(
        collectionType: string,
        assertEntity: AssertType<T>,
        entityId: string,
    ): Promise<T | undefined> {
        const key = this.entityKey(collectionType, entityId);
        const record = this.records[key];
        if (!record) return undefined;
        assertEntity(record);
        return record;
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

export default SnapshotRepositoryInMemory;
