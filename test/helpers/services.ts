import EventServiceInMemory from 'src/event-management/event-service-in-memory';
import TodoListService from 'src/services/todo-list';
import UserService from 'src/services/user';
import { coerceToEvent } from 'src/events/event-mapper';

export const eventService = new EventServiceInMemory({
    coerceToEvent: coerceToEvent,
});

export const todoListService = new TodoListService({
    eventService: eventService,
});

export const userService = new UserService({ eventService: eventService });
