import { Role } from 'src/shared/authorization';
import { Agent } from 'src/shared/agent';
import { makeEventUserCreated } from './events';

const createUser = (params: {
    agent: Agent;
    userId: string;
    email: string;
    roles: Role[];
}) => [
    makeEventUserCreated({
        ...params,
        eventRevision: 1,
    }),
];

export { createUser };
