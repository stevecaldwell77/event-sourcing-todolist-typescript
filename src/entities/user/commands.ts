import { CreateCommand, Command } from 'src/event-management/command';
import { UserDomainEvent } from 'src/events/user-events';
import { UserRole } from 'src/events/enums';
import { Agent } from 'src/entities/agent';
import { User } from 'src/entities/user';
import {
    generateEventUserCreated,
    generateEventUserRoleAdded,
    generateEventUserRoleRemoved,
} from 'src/entities/user/event-generators';

export type CreateUserParams = { email: string };
export const createUser: CreateCommand<
    UserDomainEvent,
    Agent,
    CreateUserParams
> = {
    name: 'createUser',
    run: (userId, agent, payload: CreateUserParams) => [
        generateEventUserCreated(agent, userId, payload),
    ],
};

type AddRoleParams = { role: UserRole };
export const addRoleToUser: Command<
    UserDomainEvent,
    Agent,
    User,
    AddRoleParams
> = {
    name: 'addRoleToUser',
    run: (userId, agent, payload: AddRoleParams) => [
        generateEventUserRoleAdded(agent, userId, payload),
    ],
};

type RemoveRoleParams = { role: UserRole };
export const removeRoleFromUser: Command<
    UserDomainEvent,
    Agent,
    User,
    RemoveRoleParams
> = {
    name: 'removeRoleFromUser',
    run: (userId, agent, payload: { role: UserRole }) => [
        generateEventUserRoleRemoved(agent, userId, payload),
    ],
};
