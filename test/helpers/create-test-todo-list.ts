import TodoListService from 'src/services/todo-list';
import { User } from 'src/entities/user';
import EventStore from 'src/event-store/event-store';
import getId from 'src/util/get-id';
import { TodoList } from 'src/entities/todo-list';
import createTestUser from './create-test-user';

const createTestTodoList = async (
    eventStore: EventStore,
    owner?: User,
): Promise<{ list: TodoList; listId: string; user: User; userId: string }> => {
    const todoListSevice = new TodoListService({ eventStore });
    const user = owner || (await createTestUser(eventStore)).user;
    const listId = getId();
    const list = await todoListSevice.create(listId, user, {
        owner: user.userId,
        title: 'my list',
    });
    return { list, listId, user, userId: user.userId };
};

export default createTestTodoList;
