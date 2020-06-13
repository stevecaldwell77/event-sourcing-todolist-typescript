import { EntityType } from 'src/lib/enums';
import { User, mapToUser } from 'src/entities/user';
import authorization from 'src/entities/user/authorization';
import buildFromEvents from 'src/entities/user/build';
import { createUser, CreateUserParams } from 'src/entities/user/commands';
import EventBasedEntityService from './event-based-entity';

class UserService extends EventBasedEntityService<User, CreateUserParams> {
    entityType = EntityType.User;
    buildFromEvents = buildFromEvents;
    authorization = authorization;
    createCommand = createUser;
    mapToEntity = mapToUser;
}

export default UserService;
