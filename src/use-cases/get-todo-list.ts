import EventStore from 'src/event-store/event-store';
import { Agent } from 'src/entities/agent';
import { TodoList, buildTodoList } from '../entities/todo-list';

export default async (params: {
    eventStore: EventStore;
    agent: Agent;
    listId: string;
}): Promise<TodoList | undefined> => {
    const { eventStore, agent, listId } = params;
    const { snapshot, events } = await eventStore.getTodoListSourceData(listId);
    return events.length > 0
        ? buildTodoList(agent, snapshot, events)
        : undefined;
};
