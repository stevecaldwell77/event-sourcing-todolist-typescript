import { EntityType } from 'src/lib/enums';
import { TodoList, mapToTodoList } from 'src/entities/todo-list';
import authorization from 'src/entities/todo-list/authorization';
import buildFromEvents from 'src/entities/todo-list/build';
import { createList, CreateListParams } from 'src/entities/todo-list/commands';
import EventBasedEntityService from './event-based-entity';

class TodoListService extends EventBasedEntityService<
    TodoList,
    CreateListParams
> {
    entityType = EntityType.TodoList;
    buildFromEvents = buildFromEvents;
    authorization = authorization;
    createCommand = createList;
    mapToEntity = mapToTodoList;
}

export default TodoListService;
