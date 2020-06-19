import { DomainEvent } from 'src/events/domain-event';
import {
    TodoListDomainEvent,
    isTodoListDomainEvent,
    collectionType,
} from 'src/events/todo-list-events';
import { TodoList, mapToTodoList } from 'src/entities/todo-list';
import authorization from 'src/entities/todo-list/authorization';
import buildFromEvents from 'src/entities/todo-list/builder';
import {
    createTodoList,
    CreateTodoListParams,
} from 'src/entities/todo-list/commands';
import EventBasedEntityService from './event-based-entity';

class TodoListService extends EventBasedEntityService<
    TodoList,
    CreateTodoListParams,
    DomainEvent,
    TodoListDomainEvent
> {
    collectionType = collectionType;
    isEntityEvent = isTodoListDomainEvent;
    buildFromEvents = buildFromEvents;
    mapToEntity = mapToTodoList;
    authorization = authorization;
    createCommand = createTodoList;
}

export default TodoListService;
