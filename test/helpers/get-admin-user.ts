import getId from 'src/util/get-id';
import { User, newUser } from 'src/entities/user';
import { Role } from 'src/entities/authorization';

const getAdminUser = (): User => {
    const adminUser = newUser({
        userId: getId(),
        email: 'admin@example.com',
    });
    adminUser.roles = [Role.ADMIN];

    return adminUser;
};

export default getAdminUser;
