import { StructType, object, string } from 'superstruct';
import { AgentRole } from 'src/events/enums';
import { assertType } from 'src/util/types';
import { Event, IEvent } from '../event-management/event';

export const collectionType = 'User';

export type UserDomainEvent = UserCreated | UserRoleAdded | UserRoleRemoved;

export const isUserDomainEvent = (event: IEvent): event is UserDomainEvent =>
    event instanceof UserCreated ||
    event instanceof UserRoleAdded ||
    event instanceof UserRoleRemoved;

/*------------------------------------------------------------------------------
  USER_CREATED
------------------------------------------------------------------------------*/

type UserCreatedPayload = StructType<typeof UserCreatedPayload>;
const UserCreatedPayload = object({
    email: string(),
});

export class UserCreated extends Event<UserCreatedPayload> {
    static collectionType = collectionType;
    static eventName = 'USER_CREATED';
    static assertPayload = assertType(UserCreatedPayload);
}

/*------------------------------------------------------------------------------
  USER_ROLE_ADDED
------------------------------------------------------------------------------*/

type UserRoleAddedPayload = StructType<typeof UserRoleAddedPayload>;
const UserRoleAddedPayload = object({
    role: AgentRole,
});

export class UserRoleAdded extends Event<UserRoleAddedPayload> {
    static collectionType = collectionType;
    static eventName = 'USER_ROLE_ADDED';
    static assertPayload = assertType(UserRoleAddedPayload);
}

/*------------------------------------------------------------------------------
  USER_ROLE_REMOVED
------------------------------------------------------------------------------*/

type UserRoleRemovedPayload = StructType<typeof UserRoleRemovedPayload>;
const UserRoleRemovedPayload = object({
    role: AgentRole,
});

export class UserRoleRemoved extends Event<UserRoleRemovedPayload> {
    static collectionType = collectionType;
    static eventName = 'USER_ROLE_REMOVED';
    static assertPayload = assertType(UserRoleRemovedPayload);
}
