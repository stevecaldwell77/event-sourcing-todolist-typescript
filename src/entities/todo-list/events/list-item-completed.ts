import is from '@sindresorhus/is';
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

const isEvent = (event: EntityEvent): event is Event =>
    event.eventName === eventName;

function assertIsValidEvent(event: EntityEvent): asserts event is Event {
    if (event.eventName !== eventName)
        throw new Error(`event does not have eventName of ${eventName}`);
    if (!is.plainObject((event as Event).payload))
        throw new Error('event missing payload');
    if (!is.string((event as Event).payload.itemId))
        throw new Error('event payload has invalid value for itemId');
}

export {
    // eslint-disable-next-line no-undef
    Event as EventListItemCompleted,
    isEvent as isEventListItemCompleted,
    assertIsValidEvent as assertIsValidEventListItemCompleted,
    makeEvent as makeEventListItemCompleted,
};
