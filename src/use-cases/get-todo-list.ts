import { EntityEvent } from 'src/entities/entity-event';
import { TodoList, buildTodoList } from '../entities/todo-list';

export default async (params: {
    listId: string;
    getTodoListSourceData: (
        listId: string,
    ) => Promise<{ snapshot?: TodoList; events: EntityEvent[] }>;
}): Promise<TodoList | undefined> => {
    const { listId, getTodoListSourceData } = params;
    const { snapshot, events } = await getTodoListSourceData(listId);
    // TODO: authenticate
    return buildTodoList(snapshot, events);
};
