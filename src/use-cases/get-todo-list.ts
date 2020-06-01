import { EntityEvent } from 'src/entities/entity-event';
import { Agent } from 'src/entities/agent';
import { TodoList, buildTodoList } from '../entities/todo-list';

export default async (params: {
    agent: Agent;
    listId: string;
    getTodoListSourceData: (
        listId: string,
    ) => Promise<{ snapshot?: TodoList; events: EntityEvent[] }>;
}): Promise<TodoList | undefined> => {
    const { agent, listId, getTodoListSourceData } = params;
    const { snapshot, events } = await getTodoListSourceData(listId);
    // TODO: authenticate
    return buildTodoList(agent, snapshot, events);
};
