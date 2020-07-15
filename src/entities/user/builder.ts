import {
    assertUnknownEvent,
    entityBuilder,
} from 'src/event-management/entity-builder';
import {
    UserCreated,
    UserRoleAdded,
    UserRoleRemoved,
    UserEvent,
} from 'src/events/user-events';
import { User, newUser } from 'src/entities/user';

const handleUserCreated = (event: UserCreated): User =>
    newUser({
        userId: event.collectionId,
        email: event.payload.email,
    });

const handleUserRoleAdded = (user: User, event: UserRoleAdded): User => {
    user.roles.push(event.payload.role);
    return user;
};

const handleUserRoleRemoved = (user: User, event: UserRoleRemoved): User => {
    user.roles = user.roles.filter((role) => role !== event.payload.role);
    return user;
};

const handleUserEvent = (user: User | undefined, event: UserEvent): User => {
    if (event instanceof UserCreated) return handleUserCreated(event);
    if (!user) throw new Error(`${event.getEventName()} requires a User`);

    if (event instanceof UserRoleAdded) return handleUserRoleAdded(user, event);
    if (event instanceof UserRoleRemoved)
        return handleUserRoleRemoved(user, event);
    return assertUnknownEvent(event);
};

export default entityBuilder({
    label: 'User',
    eventHandler: handleUserEvent,
});
