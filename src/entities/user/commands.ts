import { Role } from 'src/shared/authorization';
import { Agent } from 'src/shared/agent';
import { User } from 'src/entities/user';
import {
    makeEventUserCreated,
    makeEventUserRoleAdded,
    makeEventUserRoleRemoved,
} from './events';

const createUser = (params: {
    agent: Agent;
    userId: string;
    email: string;
}) => [
    makeEventUserCreated({
        ...params,
        eventRevision: 1,
    }),
];

const addRoleToUser = (params: { agent: Agent; user: User; role: Role }) => [
    makeEventUserRoleAdded({
        agent: params.agent,
        userId: params.user.userId,
        eventRevision: params.user.revision + 1,
        role: params.role,
    }),
];

const removeRoleFromUser = (params: {
    agent: Agent;
    user: User;
    role: Role;
}) => [
    makeEventUserRoleRemoved({
        agent: params.agent,
        userId: params.user.userId,
        eventRevision: params.user.revision + 1,
        role: params.role,
    }),
];

export { createUser, addRoleToUser, removeRoleFromUser };
