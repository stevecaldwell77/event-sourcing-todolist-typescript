import EntityService from 'src/event-management/entity-service';
import { TodoListAppEvent } from 'src/events/todolist-app-event';
import {
    TodoListEvent,
    isTodoListEvent,
    collectionType,
} from 'src/events/todo-list-events';
import { TodoList, assertTodoList } from 'src/entities/todo-list';
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
    TodoListAppEvent,
    TodoListEvent,
    Agent
> {
    collectionType = collectionType;
    isEntityEvent = isTodoListEvent;
    buildFromEvents = buildFromEvents;
    assertEntity = assertTodoList;
    authorization = authorization;
    createCommand = createTodoList;
}

export default TodoListService;
