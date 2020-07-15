import { StructType, object, string, number } from 'superstruct';
import { assertType } from 'src/util/types';
import { Event, IEvent } from '../event-management/event';

export const collectionType = 'TodoList';

export type TodoListDomainEvent =
    | TodoListCreated
    | TodoListItemCreated
    | TodoListItemCompleted
    | TodoListItemUncompleted
    | TodoListItemMoved;

export const isTodoListDomainEvent = (
    event: IEvent,
): event is TodoListDomainEvent =>
    event instanceof TodoListCreated ||
    event instanceof TodoListItemCreated ||
    event instanceof TodoListItemCompleted ||
    event instanceof TodoListItemUncompleted ||
    event instanceof TodoListItemMoved;

/*------------------------------------------------------------------------------
  TODO_LIST_CREATED
------------------------------------------------------------------------------*/

type TodoListCreatedPayload = StructType<typeof TodoListCreatedPayload>;
const TodoListCreatedPayload = object({
    owner: string(),
    title: string(),
});

export class TodoListCreated extends Event<TodoListCreatedPayload> {
    static collectionType = collectionType;
    static eventName = 'TODO_LIST_CREATED';
    static assertPayload = assertType(TodoListCreatedPayload);
}

/*------------------------------------------------------------------------------
  TODO_LIST_ITEM_CREATED
------------------------------------------------------------------------------*/

type TodoListItemCreatedPayload = StructType<typeof TodoListItemCreatedPayload>;
const TodoListItemCreatedPayload = object({
    itemId: string(),
    text: string(),
});

export class TodoListItemCreated extends Event<TodoListItemCreatedPayload> {
    static collectionType = collectionType;
    static eventName = 'TODO_LIST_ITEM_CREATED';
    static assertPayload = assertType(TodoListItemCreatedPayload);
}

/*------------------------------------------------------------------------------
  TODO_LIST_ITEM_COMPLETED
------------------------------------------------------------------------------*/

type TodoListItemCompletedPayload = StructType<
    typeof TodoListItemCompletedPayload
>;
const TodoListItemCompletedPayload = object({
    itemId: string(),
});

export class TodoListItemCompleted extends Event<TodoListItemCompletedPayload> {
    static collectionType = collectionType;
    static eventName = 'TODO_LIST_ITEM_COMPLETED';
    static assertPayload = assertType(TodoListItemCompletedPayload);
}

/*------------------------------------------------------------------------------
  TODO_LIST_ITEM_UNCOMPLETED
------------------------------------------------------------------------------*/

type TodoListItemUncompletedPayload = StructType<
    typeof TodoListItemUncompletedPayload
>;
const TodoListItemUncompletedPayload = object({
    itemId: string(),
});

export class TodoListItemUncompleted extends Event<
    TodoListItemUncompletedPayload
> {
    static collectionType = collectionType;
    static eventName = 'TODO_LIST_ITEM_UNCOMPLETED';
    static assertPayload = assertType(TodoListItemUncompletedPayload);
}

/*------------------------------------------------------------------------------
  TODO_LIST_ITEM_MOVED
------------------------------------------------------------------------------*/

type TodoListItemMovedPayload = StructType<typeof TodoListItemMovedPayload>;
const TodoListItemMovedPayload = object({
    itemId: string(),
    newPosition: number(),
});

export class TodoListItemMoved extends Event<TodoListItemMovedPayload> {
    static collectionType = collectionType;
    static eventName = 'TODO_LIST_ITEM_MOVED';
    static assertPayload = assertType(TodoListItemMovedPayload);
}
