import {
    Permission,
    Authorization,
    agentHasPermission,
    assertAgentHasPermission,
} from 'src/entities/authorization';
import { Agent, getUserId } from 'src/entities/agent';
import { User } from '../user';

const assertRead = (agent: Agent, user: User): void => {
    if (getUserId(agent) === user.userId) return;
    if (agentHasPermission(agent, Permission.USER_READ_ALL)) return;
    throw new Error('NOT ALLOWED: READ_USER');
};

const commandPermissions = new Map([
    ['createUser', Permission.USER_CREATE],
    ['addRoleToUser', Permission.USER_MANAGE_ROLES],
    ['removeRoleFromUser', Permission.USER_MANAGE_ROLES],
]);

const assertCommand = (agent: Agent, command: string): void => {
    const permission = commandPermissions.get(command);
    if (!permission)
        throw new Error(`No permissions defined for command ${command}`);
    assertAgentHasPermission(agent, permission);
};

const authorization: Authorization<User> = { assertRead, assertCommand };

export default authorization;
