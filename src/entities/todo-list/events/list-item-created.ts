import is from '@sindresorhus/is';
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

function assertIsValidEvent(event: EntityEvent): asserts event is Event {
    if (event.eventName !== eventName)
        throw new Error(`event does not have eventName of ${eventName}`);
    if (!is.plainObject((event as Event).payload))
        throw new Error('event missing payload');
    if (!is.string((event as Event).payload.itemId))
        throw new Error('event payload has invalid value for itemId');
    if (!is.string((event as Event).payload.text))
        throw new Error('event payload has invalid value for text');
}

export {
    // eslint-disable-next-line no-undef
    Event as EventListItemCreated,
    isEvent as isEventListItemCreated,
    assertIsValidEvent as assertIsValidEventListItemCreated,
    makeEvent as makeEventListItemCreated,
};
