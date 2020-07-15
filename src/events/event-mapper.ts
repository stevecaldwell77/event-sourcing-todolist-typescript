import { assert } from '@sindresorhus/is/dist';
import { AppEvent } from './app-event';
import { UserCreated, UserRoleAdded, UserRoleRemoved } from './user-events';
import {
    TodoListCreated,
    TodoListItemCreated,
    TodoListItemCompleted,
    TodoListItemUncompleted,
    TodoListItemMoved,
} from './todo-list-events';

export const coerceToEvent = (input: unknown): AppEvent => {
    assert.plainObject(input);
    assert.string(input.eventName);

    switch (input.eventName) {
        case UserCreated.eventName:
            return UserCreated.coerce(input);
        case UserRoleAdded.eventName:
            return UserRoleAdded.coerce(input);
        case UserRoleRemoved.eventName:
            return UserRoleRemoved.coerce(input);
        case TodoListCreated.eventName:
            return TodoListCreated.coerce(input);
        case TodoListItemCreated.eventName:
            return TodoListItemCreated.coerce(input);
        case TodoListItemCompleted.eventName:
            return TodoListItemCompleted.coerce(input);
        case TodoListItemUncompleted.eventName:
            return TodoListItemUncompleted.coerce(input);
        case TodoListItemMoved.eventName:
            return TodoListItemMoved.coerce(input);
        default:
            throw new Error(`Unknown event ${input.eventName}`);
    }
};
