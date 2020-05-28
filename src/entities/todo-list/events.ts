import { Agent } from 'src/shared/agent';
import { EntityType, EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { makeEvent } from 'src/shared/make-event';

export interface EventListCreated extends EntityEvent {
    readonly payload: {
        owner: string;
        title: string;
    };
}
export interface EventListItemCreated extends EntityEvent {
    readonly payload: {
        itemId: string;
        text: string;
    };
}

export interface EventListItemCompleted extends EntityEvent {
    readonly payload: {
        itemId: string;
    };
}

export interface EventListItemUncompleted extends EntityEvent {
    readonly payload: {
        itemId: string;
    };
}

export interface EventListItemMoved extends EntityEvent {
    readonly payload: {
        itemId: string;
        newPosition: number;
    };
}

interface TodoListEventParams {
    eventId?: string;
    eventTimestamp?: number;
    eventRevision: number;
    listId: string;
    agent: Agent;
}

const makeTodoListEvent = (
    params: TodoListEventParams,
    eventName: EventName,
): EntityEvent =>
    makeEvent({
        ...params,
        entity: EntityType.TodoList,
        entityId: params.listId,
        eventName,
    });

export const makeEventListCreated = (
    params: TodoListEventParams & { owner: string; title: string },
): EventListCreated => ({
    ...makeTodoListEvent(params, EventName.LIST_CREATED),
    payload: {
        owner: params.owner,
        title: params.title,
    },
});

export const makeEventListItemCreated = (
    params: TodoListEventParams & { itemId: string; text: string },
): EventListItemCreated => ({
    ...makeTodoListEvent(params, EventName.LIST_ITEM_CREATED),
    payload: {
        itemId: params.itemId,
        text: params.text,
    },
});

export const makeEventListItemCompleted = (
    params: TodoListEventParams & { itemId: string },
): EventListItemCompleted => ({
    ...makeTodoListEvent(params, EventName.LIST_ITEM_COMPLETED),
    payload: {
        itemId: params.itemId,
    },
});

export const makeEventListItemUncompleted = (
    params: TodoListEventParams & { itemId: string },
): EventListItemUncompleted => ({
    ...makeTodoListEvent(params, EventName.LIST_ITEM_UNCOMPLETED),
    payload: {
        itemId: params.itemId,
    },
});

export const makeEventListItemMoved = (
    params: TodoListEventParams & {
        itemId: string;
        newPosition: number;
    },
): EventListItemMoved => ({
    ...makeTodoListEvent(params, EventName.LIST_ITEM_MOVED),
    payload: {
        itemId: params.itemId,
        newPosition: params.newPosition,
    },
});

export const isEventListCreated = (
    event: EntityEvent,
): event is EventListCreated => event.eventName === EventName.LIST_CREATED;

export const isEventListItemCreated = (
    event: EntityEvent,
): event is EventListItemCreated =>
    event.eventName === EventName.LIST_ITEM_CREATED;

export const isEventListItemCompleted = (
    event: EntityEvent,
): event is EventListItemCompleted =>
    event.eventName === EventName.LIST_ITEM_COMPLETED;

export const isEventListItemUncompleted = (
    event: EntityEvent,
): event is EventListItemCompleted =>
    event.eventName === EventName.LIST_ITEM_UNCOMPLETED;

export const isEventListItemMoved = (
    event: EntityEvent,
): event is EventListItemMoved => event.eventName === EventName.LIST_ITEM_MOVED;
