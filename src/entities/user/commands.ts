import {
    Role,
    Permission,
    assertAgentHasPermission,
} from 'src/entities/authorization';
import { Agent } from 'src/entities/agent';
import { User } from 'src/entities/user';
import { makeEventUserCreated } from './events/user-created';
import { makeEventUserRoleAdded } from './events/user-role-added';
import { makeEventUserRoleRemoved } from './events/user-role-removed';

interface CommandParams {
    agent: Agent;
    user: User;
}

const eventBasics = (params: CommandParams) => ({
    agent: params.agent,
    eventRevision: params.user.revision + 1,
    entityId: params.user.userId,
});

const createUser = (params: {
    agent: Agent;
    userId: string;
    email: string;
}) => {
    assertAgentHasPermission(params.agent, Permission.USER_CREATE);
    return [
        makeEventUserCreated({
            agent: params.agent,
            entityId: params.userId,
            payload: { email: params.email },
            eventRevision: 1,
        }),
    ];
};

const addRoleToUser = (params: { agent: Agent; user: User; role: Role }) => {
    assertAgentHasPermission(params.agent, Permission.USER_MANAGE_ROLES);
    return [
        makeEventUserRoleAdded({
            ...eventBasics(params),
            payload: { role: params.role },
        }),
    ];
};

const removeRoleFromUser = (params: {
    agent: Agent;
    user: User;
    role: Role;
}) => {
    assertAgentHasPermission(params.agent, Permission.USER_MANAGE_ROLES);
    return [
        makeEventUserRoleRemoved({
            ...eventBasics(params),
            payload: { role: params.role },
        }),
    ];
};

export { createUser, addRoleToUser, removeRoleFromUser };
