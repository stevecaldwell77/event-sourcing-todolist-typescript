import is from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import {
    EntityEvent,
    EventParams,
    makeEvent as makeBaseEvent,
} from 'src/entities/entity-event';
import { entityType } from 'src/entities/todo-list';

const eventName = EventName.LIST_ITEM_UNCOMPLETED;

interface Payload {
    itemId: string;
}

interface EventListItemUncompleted extends EntityEvent {
    readonly payload: Payload;
}

const makeEvent = (
    params: Omit<EventParams, 'entityType' | 'eventName'> & {
        payload: Payload;
    },
): EventListItemUncompleted => ({
    ...makeBaseEvent({ ...params, entityType, eventName }),
    payload: params.payload,
});

const isEvent = (event: EntityEvent): event is EventListItemUncompleted =>
    event.eventName === eventName;

function assertIsValidEvent(
    event: EntityEvent,
): asserts event is EventListItemUncompleted {
    if (event.eventName !== eventName)
        throw new Error(`event does not have eventName of ${eventName}`);
    if (!is.plainObject((event as EventListItemUncompleted).payload))
        throw new Error('event missing payload');
    if (!is.string((event as EventListItemUncompleted).payload.itemId))
        throw new Error('event payload has invalid value for itemId');
}

export {
    // eslint-disable-next-line no-undef
    EventListItemUncompleted,
    isEvent as isEventListItemUncompleted,
    assertIsValidEvent as assertIsValidEventListItemUncompleted,
    makeEvent as makeEventListItemUncompleted,
};
