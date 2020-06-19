import assert from 'assert';
import {
    Permission,
    Authorization,
    agentHasPermission,
} from 'src/entities/authorization';
import { Agent, getUserId } from 'src/entities/agent';
import { TodoList } from '../todo-list';

const agentOwnsList = (agent: Agent, list: TodoList) =>
    getUserId(agent) === list.owner;

const assertRead = (agent: Agent, list: TodoList): void => {
    if (agentOwnsList(agent, list)) return;
    if (agentHasPermission(agent, Permission.LIST_READ_ALL)) return;
    throw new Error('NOT ALLOWED: READ_LIST');
};

const assertCommand = (
    agent: Agent,
    command: string,
    list?: TodoList,
): void => {
    // Anyone can create a list
    if (command === 'createTodoList') return;

    // All other commands must be done by list owner
    if (!list) throw new Error(`Unexpected: no list for command ${command}`);
    assert(agentOwnsList(agent, list), 'LIST USER MISMATCH');
};

const authorization: Authorization<TodoList> = { assertRead, assertCommand };

export default authorization;
