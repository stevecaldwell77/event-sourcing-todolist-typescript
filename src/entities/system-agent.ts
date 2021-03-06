import { AgentRole } from 'src/events/enums';

export type SystemAgent = {
    agentId: 'SYSTEM_AGENT';
    roles: AgentRole[];
};

export const systemAgent: SystemAgent = {
    agentId: 'SYSTEM_AGENT',
    roles: ['ADMIN'],
};
