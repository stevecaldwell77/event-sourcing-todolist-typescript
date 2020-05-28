import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { TodoListEventParams, makeTodoListEvent } from '../events';

const eventName = EventName.LIST_ITEM_UNCOMPLETED;

export interface EventListItemUncompleted extends EntityEvent {
    readonly payload: {
        itemId: string;
    };
}

export const makeEventListItemUncompleted = (
    params: TodoListEventParams & { itemId: string },
): EventListItemUncompleted => ({
    ...makeTodoListEvent(params, eventName),
    payload: {
        itemId: params.itemId,
    },
});

export const isEventListItemUncompleted = (
    event: EntityEvent,
): event is EventListItemUncompleted => event.eventName === eventName;
