import { Role } from 'src/entities/authorization';
import { User } from 'src/entities/user';
import { CreateCommand, Command } from 'src/entities/commands';
import { makeEventUserCreated } from './events/user-created';
import { makeEventUserRoleAdded } from './events/user-role-added';
import { makeEventUserRoleRemoved } from './events/user-role-removed';

export interface CreateUserParams {
    email: string;
}

const createUser: CreateCommand<User, CreateUserParams> = {
    name: 'createUser',
    run: (entityId, agent, params) => [
        makeEventUserCreated({
            agent,
            entityId,
            payload: { email: params.email },
            eventRevision: 1,
        }),
    ],
};

interface AddRoleToUserParams {
    role: Role;
}

const addRoleToUser: Command<User, AddRoleToUserParams> = {
    name: 'addRoleToUser',
    run: (user, agent, params) => [
        makeEventUserRoleAdded({
            agent,
            entityId: user.userId,
            payload: { role: params.role },
            eventRevision: user.revision + 1,
        }),
    ],
};

interface RemoveRoleFromUserParams {
    role: Role;
}

const removeRoleFromUser: Command<User, RemoveRoleFromUserParams> = {
    name: 'removeRoleFromUser',
    run: (user, agent, params) => [
        makeEventUserRoleRemoved({
            agent,
            entityId: user.userId,
            payload: { role: params.role },
            eventRevision: user.revision + 1,
        }),
    ],
};

export { createUser, addRoleToUser, removeRoleFromUser };
