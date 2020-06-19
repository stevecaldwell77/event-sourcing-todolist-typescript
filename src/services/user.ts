import { DomainEvent } from 'src/events/domain-event';
import {
    UserDomainEvent,
    isUserDomainEvent,
    collectionType,
} from 'src/events/user-events';
import { User, mapToUser } from 'src/entities/user';
import authorization from 'src/entities/user/authorization';
import buildFromEvents from 'src/entities/user/builder';
import { createUser, CreateUserParams } from 'src/entities/user/commands';
import EventBasedEntityService from './event-based-entity';

class UserService extends EventBasedEntityService<
    User,
    CreateUserParams,
    DomainEvent,
    UserDomainEvent
> {
    collectionType = collectionType;
    isEntityEvent = isUserDomainEvent;
    buildFromEvents = buildFromEvents;
    mapToEntity = mapToUser;
    authorization = authorization;
    createCommand = createUser;
}

export default UserService;
