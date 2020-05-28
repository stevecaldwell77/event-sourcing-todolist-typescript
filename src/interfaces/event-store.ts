import { EntityEvent } from 'src/interfaces/entity-event';
import { User } from 'src/entities/user';

export interface EventStore {
    getUserSourceData: (
        userId: string,
    ) => Promise<{ snapshot?: User; events: EntityEvent[] }>;
    saveEvents: (events: EntityEvent[]) => Promise<void>;
}
