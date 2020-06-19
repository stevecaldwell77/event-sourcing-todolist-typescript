import { assert } from '@sindresorhus/is/dist';
import { DomainEvent } from './domain-event';
import { UserCreated, UserRoleAdded, UserRoleRemoved } from './user-events';
import {
    TodoListCreated,
    TodoListItemCreated,
    TodoListItemCompleted,
    TodoListItemUncompleted,
    TodoListItemMoved,
} from './todo-list-events';

export const mapToEvent = (input: unknown): DomainEvent => {
    assert.plainObject(input);
    assert.string(input.eventName);

    switch (input.eventName) {
        case UserCreated.eventName:
            return UserCreated.map(input);
        case UserRoleAdded.eventName:
            return UserRoleAdded.map(input);
        case UserRoleRemoved.eventName:
            return UserRoleRemoved.map(input);
        case TodoListCreated.eventName:
            return TodoListCreated.map(input);
        case TodoListItemCreated.eventName:
            return TodoListItemCreated.map(input);
        case TodoListItemCompleted.eventName:
            return TodoListItemCompleted.map(input);
        case TodoListItemUncompleted.eventName:
            return TodoListItemUncompleted.map(input);
        case TodoListItemMoved.eventName:
            return TodoListItemMoved.map(input);
        default:
            throw new Error(`Unknown event ${input.eventName}`);
    }
};
