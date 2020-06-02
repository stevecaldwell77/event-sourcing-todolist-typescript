import { Agent } from 'src/entities/agent';
import { TodoList, buildTodoList } from '../entities/todo-list';
import { GetTodoListSourceData } from './types';

export default async (params: {
    getTodoListSourceData: GetTodoListSourceData;
    agent: Agent;
    listId: string;
}): Promise<TodoList | undefined> => {
    const { getTodoListSourceData, agent, listId } = params;
    const { snapshot, events } = await getTodoListSourceData(listId);
    return events.length > 0
        ? buildTodoList(agent, snapshot, events)
        : undefined;
};
