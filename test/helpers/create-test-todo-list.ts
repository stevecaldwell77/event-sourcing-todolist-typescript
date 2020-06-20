import getId from 'src/util/get-id';
import { User } from 'src/entities/user';
import { TodoList } from 'src/entities/todo-list';
import createTestUser from './create-test-user';
import { todoListService } from './services';

const createTestTodoList = async (
    owner?: User,
): Promise<{ list: TodoList; listId: string; user: User; userId: string }> => {
    const user = owner || (await createTestUser()).user;
    const listId = getId();
    const list = await todoListService.create(listId, user, {
        owner: user.userId,
        title: 'my list',
    });
    return { list, listId, user, userId: user.userId };
};

export default createTestTodoList;
