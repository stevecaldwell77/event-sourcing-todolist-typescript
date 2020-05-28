import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { TodoListEventParams, makeTodoListEvent } from '../events';

const eventName = EventName.LIST_ITEM_CREATED;

export interface EventListItemCreated extends EntityEvent {
    readonly payload: {
        itemId: string;
        text: string;
    };
}

export const makeEventListItemCreated = (
    params: TodoListEventParams & { itemId: string; text: string },
): EventListItemCreated => ({
    ...makeTodoListEvent(params, eventName),
    payload: {
        itemId: params.itemId,
        text: params.text,
    },
});

export const isEventListItemCreated = (
    event: EntityEvent,
): event is EventListItemCreated => event.eventName === eventName;
