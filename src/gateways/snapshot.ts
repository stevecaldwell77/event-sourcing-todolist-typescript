import { User } from 'src/entities/user';
import { TodoList } from 'src/entities/todo-list';

export interface SnapshotGateway {
    getTodoListSnapshot(listId: string): Promise<TodoList | undefined>;
    getUserSnapshot(userId: string): Promise<User | undefined>;
    saveTodoListSnapshot(list: TodoList): Promise<void>;
    saveUserSnapshot(user: User): Promise<void>;
}
