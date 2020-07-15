import EntityService from 'src/event-management/entity-service';
import { DomainEvent } from 'src/events/domain-event';
import {
    TodoListDomainEvent,
    isTodoListDomainEvent,
    collectionType,
} from 'src/events/todo-list-events';
import { TodoList, coerceToTodoList } from 'src/entities/todo-list';
import authorization from 'src/entities/todo-list/authorization';
import buildFromEvents from 'src/entities/todo-list/builder';
import {
    createTodoList,
    CreateTodoListParams,
} from 'src/entities/todo-list/commands';
import { Agent } from 'src/entities/agent';

class TodoListService extends EntityService<
    TodoList,
    CreateTodoListParams,
    DomainEvent,
    TodoListDomainEvent,
    Agent
> {
    collectionType = collectionType;
    isEntityEvent = isTodoListDomainEvent;
    buildFromEvents = buildFromEvents;
    coerceToEntity = coerceToTodoList;
    authorization = authorization;
    createCommand = createTodoList;
}

export default TodoListService;
