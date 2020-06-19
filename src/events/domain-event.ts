import { UserDomainEvent } from './user-events';
import { TodoListDomainEvent } from './todo-list-events';

export type DomainEvent = UserDomainEvent | TodoListDomainEvent;
