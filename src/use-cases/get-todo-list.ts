import { TodoList, makeTodoList } from '../entities/todo-list';
import { EntityEvent } from '../entities/event';

export default async (params: {
    listId: string;
    getTodoListSourceData: (
        listId: string,
    ) => Promise<{ snapshot?: TodoList; events: EntityEvent[] }>;
}): Promise<TodoList | undefined> => {
    const { listId, getTodoListSourceData } = params;
    const { snapshot, events } = await getTodoListSourceData(listId);
    return makeTodoList(snapshot, events);
};
