import { EventName } from 'src/lib/enums';
import { EntityEvent } from 'src/interfaces/entity-event';
import { TodoListEventParams, makeTodoListEvent } from '../events';

const eventName = EventName.LIST_CREATED;

export interface EventListCreated extends EntityEvent {
    readonly payload: {
        owner: string;
        title: string;
    };
}

export const makeEventListCreated = (
    params: TodoListEventParams & { owner: string; title: string },
): EventListCreated => ({
    ...makeTodoListEvent(params, eventName),
    payload: {
        owner: params.owner,
        title: params.title,
    },
});

export const isEventListCreated = (
    event: EntityEvent,
): event is EventListCreated => event.eventName === eventName;
