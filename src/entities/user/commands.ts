import {
    Role,
    Permission,
    assertAgentHasPermission,
} from 'src/shared/authorization';
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
}) => {
    assertAgentHasPermission(params.agent, Permission.CREATE_USER);
    return [
        makeEventUserCreated({
            ...params,
            eventRevision: 1,
        }),
    ];
};

const addRoleToUser = (params: { agent: Agent; user: User; role: Role }) => {
    assertAgentHasPermission(params.agent, Permission.MANAGE_USER_ROLES);
    return [
        makeEventUserRoleAdded({
            agent: params.agent,
            userId: params.user.userId,
            eventRevision: params.user.revision + 1,
            role: params.role,
        }),
    ];
};

const removeRoleFromUser = (params: {
    agent: Agent;
    user: User;
    role: Role;
}) => {
    assertAgentHasPermission(params.agent, Permission.MANAGE_USER_ROLES);
    return [
        makeEventUserRoleRemoved({
            agent: params.agent,
            userId: params.user.userId,
            eventRevision: params.user.revision + 1,
            role: params.role,
        }),
    ];
};

export { createUser, addRoleToUser, removeRoleFromUser };
