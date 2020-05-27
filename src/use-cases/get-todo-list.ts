import { EntityEvent } from 'src/interfaces/entity-event';
import { TodoList, makeTodoList } from '../entities/todo-list';

export default async (params: {
    listId: string;
    getTodoListSourceData: (
        listId: string,
    ) => Promise<{ snapshot?: TodoList; events: EntityEvent[] }>;
}): Promise<TodoList | undefined> => {
    const { listId, getTodoListSourceData } = params;
    const { snapshot, events } = await getTodoListSourceData(listId);
    // TODO: authenticate
    return makeTodoList(snapshot, events);
};
