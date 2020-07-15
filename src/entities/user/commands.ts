import { CreateCommand, Command } from 'src/event-management/command';
import { UserEvent } from 'src/events/user-events';
import { AgentRole } from 'src/events/enums';
import { Agent } from 'src/entities/agent';
import { User } from 'src/entities/user';
import {
    generateEventUserCreated,
    generateEventUserRoleAdded,
    generateEventUserRoleRemoved,
} from 'src/entities/user/event-generators';

export type CreateUserParams = { email: string };
export const createUser: CreateCommand<UserEvent, Agent, CreateUserParams> = {
    name: 'createUser',
    run: (userId, agent, payload: CreateUserParams) => [
        generateEventUserCreated(agent, userId, payload),
    ],
};

type AddRoleParams = { role: AgentRole };
export const addRoleToUser: Command<UserEvent, Agent, User, AddRoleParams> = {
    name: 'addRoleToUser',
    run: (userId, agent, payload: AddRoleParams) => [
        generateEventUserRoleAdded(agent, userId, payload),
    ],
};

type RemoveRoleParams = { role: AgentRole };
export const removeRoleFromUser: Command<
    UserEvent,
    Agent,
    User,
    RemoveRoleParams
> = {
    name: 'removeRoleFromUser',
    run: (userId, agent, payload: { role: AgentRole }) => [
        generateEventUserRoleRemoved(agent, userId, payload),
    ],
};
