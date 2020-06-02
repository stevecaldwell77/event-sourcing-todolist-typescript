import { TodoList, buildTodoList, commands } from 'src/entities/todo-list';
import { User } from 'src/entities/user';
import { SaveEvents, GetTodoListSourceData } from './types';

const assertNotExists = async (
    getTodoListSourceData: GetTodoListSourceData,
    listId: string,
) => {
    const { events } = await getTodoListSourceData(listId);
    if (events.length > 0) {
        throw new Error(`TodoList ${listId} already exists`);
    }
};

export default async (params: {
    getTodoListSourceData: GetTodoListSourceData;
    saveEvents: SaveEvents;
    user: User;
    listId: string;
    title: string;
}): Promise<TodoList> => {
    const { getTodoListSourceData, saveEvents, user, listId } = params;
    await assertNotExists(getTodoListSourceData, listId);

    const events = commands.createList({
        agent: user,
        listId,
        owner: user.userId,
        title: params.title,
    });

    await saveEvents(events);

    return buildTodoList(user, undefined, events);
};
