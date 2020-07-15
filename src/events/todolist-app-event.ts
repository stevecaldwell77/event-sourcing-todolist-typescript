import { UserEvent } from './user-events';
import { TodoListEvent } from './todo-list-events';

export type TodoListAppEvent = UserEvent | TodoListEvent;
