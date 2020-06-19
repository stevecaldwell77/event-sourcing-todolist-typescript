import * as t from 'io-ts';
import { Event, IEvent } from '../event-management/event';
import { userRoleSchema } from './enums';

export const collectionType = 'User';

export type UserDomainEvent = UserCreated | UserRoleAdded | UserRoleRemoved;

export const isUserDomainEvent = (event: IEvent): event is UserDomainEvent =>
    event instanceof UserCreated ||
    event instanceof UserRoleAdded ||
    event instanceof UserRoleRemoved;

/*------------------------------------------------------------------------------
  USER_CREATED
------------------------------------------------------------------------------*/

const userCreatedPayloadSchema = t.type({
    email: t.string,
});

export class UserCreated extends Event<
    t.TypeOf<typeof userCreatedPayloadSchema>
> {
    static collectionType = collectionType;
    static eventName = 'USER_CREATED';
    static payloadSchema = userCreatedPayloadSchema;
}

/*------------------------------------------------------------------------------
  USER_ROLE_ADDED
------------------------------------------------------------------------------*/

const userRoleAddedPayloadSchema = t.type({
    role: userRoleSchema,
});

export class UserRoleAdded extends Event<
    t.TypeOf<typeof userRoleAddedPayloadSchema>
> {
    static collectionType = collectionType;
    static eventName = 'USER_ROLE_ADDED';
    static payloadSchema = userRoleAddedPayloadSchema;
}

/*------------------------------------------------------------------------------
  USER_ROLE_REMOVED
------------------------------------------------------------------------------*/

const userRoleRemovedPayloadSchema = t.type({
    role: userRoleSchema,
});

export class UserRoleRemoved extends Event<
    t.TypeOf<typeof userRoleRemovedPayloadSchema>
> {
    static collectionType = collectionType;
    static eventName = 'USER_ROLE_REMOVED';
    static payloadSchema = userRoleRemovedPayloadSchema;
}
