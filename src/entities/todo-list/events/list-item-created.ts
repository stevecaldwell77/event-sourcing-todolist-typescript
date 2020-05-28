import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { TodoListEventParams, makeTodoListEvent } from '../events';

const eventName = EventName.LIST_ITEM_CREATED;

interface Event extends EntityEvent {
    readonly payload: {
        itemId: string;
        text: string;
    };
}

const makeEvent = (
    params: TodoListEventParams & { itemId: string; text: string },
): Event => ({
    ...makeTodoListEvent(params, eventName),
    payload: {
        itemId: params.itemId,
        text: params.text,
    },
});

const isEvent = (event: EntityEvent): event is Event =>
    event.eventName === eventName;

export {
    // eslint-disable-next-line no-undef
    Event as EventListItemCreated,
    isEvent as isEventListItemCreated,
    makeEvent as makeEventListItemCreated,
};
