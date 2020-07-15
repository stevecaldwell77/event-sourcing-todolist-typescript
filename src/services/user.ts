import EntityService from 'src/event-management/entity-service';
import { DomainEvent } from 'src/events/domain-event';
import {
    UserDomainEvent,
    isUserDomainEvent,
    collectionType,
} from 'src/events/user-events';
import { User, coerceToUser } from 'src/entities/user';
import authorization from 'src/entities/user/authorization';
import buildFromEvents from 'src/entities/user/builder';
import { createUser, CreateUserParams } from 'src/entities/user/commands';
import { Agent } from 'src/entities/agent';

class UserService extends EntityService<
    User,
    CreateUserParams,
    DomainEvent,
    UserDomainEvent,
    Agent
> {
    collectionType = collectionType;
    isEntityEvent = isUserDomainEvent;
    buildFromEvents = buildFromEvents;
    coerceToEntity = coerceToUser;
    authorization = authorization;
    createCommand = createUser;
}

export default UserService;
