import { Role } from 'src/entities/authorization';
import { User } from 'src/entities/user';

type SystemAgent = {
    agentId: 'SYSTEM_AGENT';
    roles: Role[];
};

export type Agent = User | SystemAgent;

export const systemAgent: SystemAgent = {
    agentId: 'SYSTEM_AGENT',
    roles: ['ADMIN'],
};

const isUser = (agent: Agent): agent is User => {
    return (agent as User).userId !== undefined;
};

export const getUserId = (agent: Agent): string | undefined => {
    return isUser(agent) ? agent.userId : undefined;
};

export const getAgentId = (agent: Agent): string => {
    return isUser(agent) ? agent.userId : agent.agentId;
};
