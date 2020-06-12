import { User, authorization } from 'src/entities/user';
import buildFromEvents from 'src/entities/user/build';
import { createUser, CreateUserParams } from 'src/entities/user/commands';
import { EntityEvent } from 'src/entities/entity-event';
import EventBasedEntityService from './event-based-entity';

class UserService extends EventBasedEntityService<User, CreateUserParams> {
    buildFromEvents = buildFromEvents;
    authorization = authorization;
    createCommand = createUser;

    async getSourceData(
        userId: string,
    ): Promise<{ snapshot?: User; events: EntityEvent[] }> {
        return this.eventStore.getUserSourceData(userId);
    }
}

export default UserService;
