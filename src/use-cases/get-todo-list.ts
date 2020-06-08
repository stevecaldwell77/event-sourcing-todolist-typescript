import { Agent } from 'src/entities/agent';
import {
    TodoList,
    buildTodoList,
    assertReadAuthorized,
} from '../entities/todo-list';
import { GetTodoListSourceData } from './types';
import getEventBasedEntity from './get-events-based-entity';

export default async (params: {
    getTodoListSourceData: GetTodoListSourceData;
    agent: Agent;
    listId: string;
}): Promise<TodoList | undefined> =>
    getEventBasedEntity({
        getSourceData: params.getTodoListSourceData,
        buildEntity: buildTodoList,
        assertReadAuthorized,
        agent: params.agent,
        entityId: params.listId,
    });
