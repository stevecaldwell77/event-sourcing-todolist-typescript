import { TodoList } from 'src/entities/todo-list';
import authorization from 'src/entities/todo-list/authorization';
import buildFromEvents from 'src/entities/todo-list/build';
import { createList, CreateListParams } from 'src/entities/todo-list/commands';
import { EntityEvent } from 'src/entities/entity-event';
import EventBasedEntityService from './event-based-entity';

class TodoListService extends EventBasedEntityService<
    TodoList,
    CreateListParams
> {
    buildFromEvents = buildFromEvents;
    authorization = authorization;
    createCommand = createList;

    async getSourceData(
        listId: string,
    ): Promise<{ snapshot?: TodoList; events: EntityEvent[] }> {
        return this.eventStore.getTodoListSourceData(listId);
    }
}

export default TodoListService;
