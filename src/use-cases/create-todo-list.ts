import { TodoList, buildTodoList, commands } from 'src/entities/todo-list';
import { User } from 'src/entities/user';
import { EntityType } from 'src/lib/enums';
import { SaveEvents, GetTodoListSourceData } from './types';
import runCommandAndUpdate from './run-command-and-update';

export default async (params: {
    getTodoListSourceData: GetTodoListSourceData;
    saveEvents: SaveEvents;
    user: User;
    listId: string;
    title: string;
}): Promise<TodoList> =>
    runCommandAndUpdate({
        isCreateCommand: true,
        getSourceData: params.getTodoListSourceData,
        runCommand: () =>
            commands.createList({
                agent: params.user,
                listId: params.listId,
                owner: params.user.userId,
                title: params.title,
            }),
        saveEvents: params.saveEvents,
        buildEntity: buildTodoList,
        agent: params.user,
        entityType: EntityType.TodoList,
        entityId: params.listId,
    });
