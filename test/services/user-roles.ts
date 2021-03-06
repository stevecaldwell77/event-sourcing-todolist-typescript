import test from 'ava';
import getId from 'src/util/get-id';
import { addRoleToUser, removeRoleFromUser } from 'src/entities/user/commands';
import getAdminUser from 'test/helpers/get-admin-user';
import { userService } from 'test/helpers/services';

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
