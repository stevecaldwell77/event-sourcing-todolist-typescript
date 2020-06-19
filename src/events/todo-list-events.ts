import * as t from 'io-ts';
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

const todoListCreatedPayloadSchema = t.type({
    owner: t.string,
    title: t.string,
});

export class TodoListCreated extends Event<
    t.TypeOf<typeof todoListCreatedPayloadSchema>
> {
    static collectionType = collectionType;
    static eventName = 'TODO_LIST_CREATED';
    static payloadSchema = todoListCreatedPayloadSchema;
}

/*------------------------------------------------------------------------------
  TODO_LIST_ITEM_CREATED
------------------------------------------------------------------------------*/

const todoListItemCreatedPayloadSchema = t.type({
    itemId: t.string,
    text: t.string,
});

export class TodoListItemCreated extends Event<
    t.TypeOf<typeof todoListItemCreatedPayloadSchema>
> {
    static collectionType = collectionType;
    static eventName = 'TODO_LIST_ITEM_CREATED';
    static payloadSchema = todoListItemCreatedPayloadSchema;
}

/*------------------------------------------------------------------------------
  TODO_LIST_ITEM_COMPLETED
------------------------------------------------------------------------------*/

const todoListItemCompletedPayloadSchema = t.type({
    itemId: t.string,
});

export class TodoListItemCompleted extends Event<
    t.TypeOf<typeof todoListItemCompletedPayloadSchema>
> {
    static collectionType = collectionType;
    static eventName = 'TODO_LIST_ITEM_COMPLETED';
    static payloadSchema = todoListItemCompletedPayloadSchema;
}

/*------------------------------------------------------------------------------
  TODO_LIST_ITEM_UNCOMPLETED
------------------------------------------------------------------------------*/

const todoListItemUncompletedPayloadSchema = t.type({
    itemId: t.string,
});

export class TodoListItemUncompleted extends Event<
    t.TypeOf<typeof todoListItemUncompletedPayloadSchema>
> {
    static collectionType = collectionType;
    static eventName = 'TODO_LIST_ITEM_UNCOMPLETED';
    static payloadSchema = todoListItemUncompletedPayloadSchema;
}

/*------------------------------------------------------------------------------
  TODO_LIST_ITEM_MOVED
------------------------------------------------------------------------------*/

const todoListItemMovedPayloadSchema = t.type({
    itemId: t.string,
    newPosition: t.number,
});

export class TodoListItemMoved extends Event<
    t.TypeOf<typeof todoListItemMovedPayloadSchema>
> {
    static collectionType = collectionType;
    static eventName = 'TODO_LIST_ITEM_MOVED';
    static payloadSchema = todoListItemMovedPayloadSchema;
}
