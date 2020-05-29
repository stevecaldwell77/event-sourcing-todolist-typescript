import getId from 'src/util/get-id';
import { systemAgent, Agent } from 'src/shared/agent';
import { EntityEvent } from 'src/entities/entity-event';
import { commands } from 'src/entities/user';

const initializeUser = (
    params: {
        agent?: Agent;
        email?: string;
    } = {},
): { events: EntityEvent[]; userId: string; agent: Agent; email: string } => {
    const agent = params.agent || systemAgent;
    const email = params.email || 'jdoe@gmail.com';
    const userId = getId();
    const events: EntityEvent[] = commands.createUser({
        agent,
        userId,
        email,
    });
    return { events, userId, agent, email };
};

export default initializeUser;
