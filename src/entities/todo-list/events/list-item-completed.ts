import { assert } from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { TodoListEventParams, makeTodoListEvent } from '../events';

const eventName = EventName.LIST_ITEM_COMPLETED;

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

const isEvent = (event: EntityEvent): event is Event => {
    if (event.eventName !== eventName) return false;
    assert.plainObject((event as Event).payload);
    assert.string((event as Event).payload.itemId);
    return true;
};

export {
    // eslint-disable-next-line no-undef
    Event as EventListItemCompleted,
    isEvent as isEventListItemCompleted,
    makeEvent as makeEventListItemCompleted,
};
