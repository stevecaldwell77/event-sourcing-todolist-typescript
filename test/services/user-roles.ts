import test from 'ava';
import EventStoreInMemory from 'src/event-management/event-store-in-memory';
import getId from 'src/util/get-id';
import { addRoleToUser, removeRoleFromUser } from 'src/entities/user/commands';
import UserService from 'src/services/user';
import getAdminUser from 'test/helpers/get-admin-user';

const eventStore = new EventStoreInMemory();
const userService = new UserService({ eventStore });

test('adding and removing roles', async (t) => {
    const adminUser = getAdminUser();
    const userId = getId();
    const email = 'jdoe@example.com';

    await userService.create(userId, adminUser, { email });

    {
        const user = await userService.getOrDie(userId, adminUser);
        t.deepEqual(user.roles, [], 'user starts with no roles');

        await userService.runCommand(addRoleToUser, user, adminUser, {
            role: 'ADMIN',
        });
        t.deepEqual(
            (await userService.getOrDie(userId, adminUser)).roles,
            ['ADMIN'],
            'admin role succesfully added to user',
        );
    }

    {
        const user = await userService.getOrDie(userId, adminUser);
        t.deepEqual(user.roles, ['ADMIN'], 'user starts with admin role');

        await userService.runCommand(removeRoleFromUser, user, adminUser, {
            role: 'ADMIN',
        });
        t.deepEqual(
            (await userService.getOrDie(userId, adminUser)).roles,
            [],
            'admin role succesfully removed from user',
        );
    }
});
