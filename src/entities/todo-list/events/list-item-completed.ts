import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { TodoListEventParams, makeTodoListEvent } from '../events';

const eventName = EventName.LIST_ITEM_COMPLETED;

export interface EventListItemCompleted extends EntityEvent {
    readonly payload: {
        itemId: string;
    };
}

export const makeEventListItemCompleted = (
    params: TodoListEventParams & { itemId: string },
): EventListItemCompleted => ({
    ...makeTodoListEvent(params, eventName),
    payload: {
        itemId: params.itemId,
    },
});

export const isEventListItemCompleted = (
    event: EntityEvent,
): event is EventListItemCompleted => event.eventName === eventName;
