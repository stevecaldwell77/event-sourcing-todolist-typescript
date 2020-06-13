import { EntityType } from 'src/lib/enums';
import { MapToEntity } from 'src/entities/types';

export interface SnapshotGateway {
    getSnapshot<T>(
        entityType: EntityType,
        mapToEntity: MapToEntity<T>,
        entityId: string,
    ): Promise<T | undefined>;
    saveSnapshot<T>(
        entityType: EntityType,
        entityId: string,
        entity: T,
    ): Promise<void>;
}
