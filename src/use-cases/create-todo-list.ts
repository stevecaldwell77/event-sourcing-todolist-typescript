import { TodoList, buildTodoList, commands } from 'src/entities/todo-list';
import { User } from 'src/entities/user';
import { SaveEvents, GetTodoListSourceData } from './types';
import runCommandAndSave from './run-command-and-save';
import getTodoList from './get-todo-list';

export default async (params: {
    getTodoListSourceData: GetTodoListSourceData;
    saveEvents: SaveEvents;
    user: User;
    listId: string;
    title: string;
}): Promise<TodoList> =>
    runCommandAndSave({
        isCreateCommand: true,
        getEntity: () =>
            getTodoList({
                getTodoListSourceData: params.getTodoListSourceData,
                agent: params.user,
                listId: params.listId,
            }),
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
        label: 'createTodoList',
    });
