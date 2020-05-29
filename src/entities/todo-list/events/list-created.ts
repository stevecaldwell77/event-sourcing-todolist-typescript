import is from '@sindresorhus/is';
import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { TodoListEventParams, makeTodoListEvent } from '../events';

const eventName = EventName.LIST_CREATED;

interface Event extends EntityEvent {
    readonly payload: {
        owner: string;
        title: string;
    };
}

const makeEvent = (
    params: TodoListEventParams & { owner: string; title: string },
): Event => ({
    ...makeTodoListEvent(params, eventName),
    payload: {
        owner: params.owner,
        title: params.title,
    },
});

const isEvent = (event: EntityEvent): event is Event =>
    event.eventName === eventName;

function assertIsValidEvent(event: EntityEvent): asserts event is Event {
    if (event.eventName !== eventName)
        throw new Error(`event does not have eventName of ${eventName}`);
    if (!is.plainObject((event as Event).payload))
        throw new Error('event missing payload');
    if (!is.string((event as Event).payload.owner))
        throw new Error('event payload has invalid value for owner');
    if (!is.string((event as Event).payload.title))
        throw new Error('event payload has invalid value for title');
}

export {
    // eslint-disable-next-line no-undef
    Event as EventListCreated,
    isEvent as isEventListCreated,
    assertIsValidEvent as assertIsValidEventListCreated,
    makeEvent as makeEventListCreated,
};
