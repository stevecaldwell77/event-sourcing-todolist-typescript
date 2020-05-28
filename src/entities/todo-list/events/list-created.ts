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

export {
    // eslint-disable-next-line no-undef
    Event as EventListCreated,
    isEvent as isEventListCreated,
    makeEvent as makeEventListCreated,
};
