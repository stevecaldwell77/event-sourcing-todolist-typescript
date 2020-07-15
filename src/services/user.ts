import EntityService from 'src/event-management/entity-service';
import { TodoListAppEvent } from 'src/events/todolist-app-event';
import { UserEvent, isUserEvent, collectionType } from 'src/events/user-events';
import { User, assertUser } from 'src/entities/user';
import authorization from 'src/entities/user/authorization';
import buildFromEvents from 'src/entities/user/builder';
import { createUser, CreateUserParams } from 'src/entities/user/commands';
import { Agent } from 'src/entities/agent';

class UserService extends EntityService<
    User,
    CreateUserParams,
    TodoListAppEvent,
    UserEvent,
    Agent
> {
    collectionType = collectionType;
    isEntityEvent = isUserEvent;
    buildFromEvents = buildFromEvents;
    assertEntity = assertUser;
    authorization = authorization;
    createCommand = createUser;
}

export default UserService;
