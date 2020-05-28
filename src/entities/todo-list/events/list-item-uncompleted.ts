import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { TodoListEventParams, makeTodoListEvent } from '../events';

const eventName = EventName.LIST_ITEM_UNCOMPLETED;

interface Event extends EntityEvent {
    readonly payload: {
        itemId: string;
    };
}

const makeEvent = (
    params: TodoListEventParams & { itemId: string },
): Event => ({
    ...makeTodoListEvent(params, eventName),
    payload: {
        itemId: params.itemId,
    },
});

const isEvent = (event: EntityEvent): event is Event =>
    event.eventName === eventName;

export {
    // eslint-disable-next-line no-undef
    Event as EventListItemUncompleted,
    isEvent as isEventListItemUncompleted,
    makeEvent as makeEventListItemUncompleted,
};
