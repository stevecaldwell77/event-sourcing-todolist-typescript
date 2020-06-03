import autoBind from 'auto-bind';
import { User } from 'src/entities/user';
import { TodoList } from 'src/entities/todo-list';
import { SnapshotGateway } from 'src/gateways/snapshot';

class SnapshotGatewayInMemory implements SnapshotGateway {
    private users: Record<string, User> = {};
    private todoLists: Record<string, TodoList> = {};

    constructor() {
        autoBind(this);
    }

    async getTodoListSnapshot(listId: string): Promise<TodoList | undefined> {
        return this.todoLists[listId];
    }

    async getUserSnapshot(userId: string): Promise<User | undefined> {
        return this.users[userId];
    }

    async saveTodoListSnapshot(list: TodoList): Promise<void> {
        this.todoLists[list.listId] = list;
    }

    async saveUserSnapshot(user: User): Promise<void> {
        this.users[user.userId] = user;
    }
}

export default SnapshotGatewayInMemory;
