import casual from 'casual';
import { systemAgent } from 'src/entities/agent';
import getId from 'src/util/get-id';
import { User } from 'src/entities/user';
import { userService } from './services';

const createTestUser = async (): Promise<{ user: User; userId: string }> => {
    const userId = getId();
    const user = await userService.create(userId, systemAgent, {
        email: casual.email,
    });
    return { user, userId };
};

export default createTestUser;
