import { assert } from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { TodoListEventParams, makeTodoListEvent } from '../events';

const eventName = EventName.LIST_ITEM_MOVED;

interface Event extends EntityEvent {
    readonly payload: {
        itemId: string;
        newPosition: number;
    };
}

const makeEvent = (
    params: TodoListEventParams & {
        itemId: string;
        newPosition: number;
    },
): Event => ({
    ...makeTodoListEvent(params, eventName),
    payload: {
        itemId: params.itemId,
        newPosition: params.newPosition,
    },
});

const isEvent = (event: EntityEvent): event is Event => {
    if (event.eventName !== eventName) return false;
    assert.plainObject((event as Event).payload);
    assert.string((event as Event).payload.itemId);
    assert.number((event as Event).payload.newPosition);
    return true;
};

export {
    // eslint-disable-next-line no-undef
    Event as EventListItemMoved,
    isEvent as isEventListItemMoved,
    makeEvent as makeEventListItemMoved,
};
