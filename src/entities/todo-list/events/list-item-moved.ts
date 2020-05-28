import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { TodoListEventParams, makeTodoListEvent } from '../events';

const eventName = EventName.LIST_ITEM_MOVED;

export interface EventListItemMoved extends EntityEvent {
    readonly payload: {
        itemId: string;
        newPosition: number;
    };
}

export const makeEventListItemMoved = (
    params: TodoListEventParams & {
        itemId: string;
        newPosition: number;
    },
): EventListItemMoved => ({
    ...makeTodoListEvent(params, eventName),
    payload: {
        itemId: params.itemId,
        newPosition: params.newPosition,
    },
});

export const isEventListItemMoved = (
    event: EntityEvent,
): event is EventListItemMoved => event.eventName === eventName;
