import * as t from 'io-ts';
import { DomainEvent } from '../event-management/domain-event';
import { userRoleSchema } from './enums';

const collectionType = 'User';

export type UserDomainEvent = UserCreated | UserRoleAdded | UserRoleRemoved;

/*------------------------------------------------------------------------------
  USER_CREATED
------------------------------------------------------------------------------*/

const userCreatedPayloadSchema = t.type({
    email: t.string,
});

export class UserCreated extends DomainEvent<
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

export class UserRoleAdded extends DomainEvent<
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

export class UserRoleRemoved extends DomainEvent<
    t.TypeOf<typeof userRoleRemovedPayloadSchema>
> {
    static collectionType = collectionType;
    static eventName = 'USER_ROLE_REMOVED';
    static payloadSchema = userRoleRemovedPayloadSchema;
}
