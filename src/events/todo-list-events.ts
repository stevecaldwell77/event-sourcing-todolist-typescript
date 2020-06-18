import * as t from 'io-ts';
import { DomainEvent } from '../event-management/domain-event';

const collectionType = 'TodoList';

export type TodoListDomainEvent =
    | TodoListCreated
    | TodoListItemCreated
    | TodoListItemCompleted
    | TodoListItemUncompleted
    | TodoListItemMoved;

/*------------------------------------------------------------------------------
  TODO_LIST_CREATED
------------------------------------------------------------------------------*/

const todoListCreatedPayloadSchema = t.type({
    owner: t.string,
    title: t.string,
});

export class TodoListCreated extends DomainEvent<
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

export class TodoListItemCreated extends DomainEvent<
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

export class TodoListItemCompleted extends DomainEvent<
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

export class TodoListItemUncompleted extends DomainEvent<
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

export class TodoListItemMoved extends DomainEvent<
    t.TypeOf<typeof todoListItemMovedPayloadSchema>
> {
    static collectionType = collectionType;
    static eventName = 'TODO_LIST_ITEM_MOVED';
    static payloadSchema = todoListItemMovedPayloadSchema;
}
