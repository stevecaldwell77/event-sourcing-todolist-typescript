import { AssertType } from './assert';

export interface SnapshotGateway {
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
