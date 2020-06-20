import TodoListService from 'src/services/todo-list';
import UserService from 'src/services/user';
import createEventStore from './event-store';

const eventStore = createEventStore();
export const todoListService = new TodoListService({ eventStore });
export const userService = new UserService({ eventStore });
