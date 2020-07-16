import { AssertType } from './assert';

export interface SnapshotRepository {
    getSnapshot<TEntity>(
        collectionType: string,
        assertEntity: AssertType<TEntity>,
        collectionId: string,
    ): Promise<TEntity | undefined>;
    saveSnapshot<TEntity>(
        collectionType: string,
        collectionId: string,
        entity: TEntity,
    ): Promise<void>;
}
