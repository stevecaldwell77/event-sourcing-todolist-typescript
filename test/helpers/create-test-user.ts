import casual from 'casual';
import EventStore from 'src/event-store/event-store';
import UserService from 'src/services/user';
import { systemAgent } from 'src/entities/agent';
import getId from 'src/util/get-id';
import { User } from 'src/entities/user';

const createTestUser = async (
    eventStore: EventStore,
): Promise<{ user: User; userId: string }> => {
    const userService = new UserService({ eventStore });
    const userId = getId();
    const user = await userService.create(userId, systemAgent, {
        email: casual.email,
    });
    return { user, userId };
};

export default createTestUser;
