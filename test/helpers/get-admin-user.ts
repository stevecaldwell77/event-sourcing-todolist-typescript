import getId from 'src/util/get-id';
import { User, newUser } from 'src/entities/user';

const getAdminUser = (): User => {
    const adminUser = newUser({
        userId: getId(),
        email: 'admin@example.com',
    });
    adminUser.roles = ['ADMIN'];

    return adminUser;
};

export default getAdminUser;
