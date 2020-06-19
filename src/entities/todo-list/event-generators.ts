import {
    generateEvent,
    generateStartingEvent,
} from 'src/event-management/event';
import {
    TodoListCreated,
    TodoListItemCreated,
    TodoListItemCompleted,
    TodoListItemUncompleted,
    TodoListItemMoved,
} from 'src/events/todo-list-events';
import { getAgentId } from 'src/entities/agent';
import { TodoList } from 'src/entities/todo-list';

const schemaVersion = 1;

export const generateEventTodoListCreated = generateStartingEvent(
    schemaVersion,
    getAgentId,
    TodoListCreated,
);

const generateTodoListEvent = generateEvent(
    schemaVersion,
    getAgentId,
    (list: TodoList) => list.listId,
);

export const generateEventTodoListItemCreated = generateTodoListEvent(
    TodoListItemCreated,
);
export const generateEventTodoListItemCompleted = generateTodoListEvent(
    TodoListItemCompleted,
);
export const generateEventTodoListItemUncompleted = generateTodoListEvent(
    TodoListItemUncompleted,
);
export const generateEventTodoListItemMoved = generateTodoListEvent(
    TodoListItemMoved,
);
