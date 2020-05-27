import { EntityEvent } from './event';
import { EventUserCreated, isEventUserCreated } from './user/events';
import * as commands from './user/commands';

export interface User {
    userId: string;
    email: string;
    revision: number;
}

const newUser = (event: EventUserCreated): User => ({
    revision: 1,
    userId: event.entityId,
    email: event.payload.email,
});

const applyEvent = (prev: User | undefined, event: EntityEvent): User => {
    if (isEventUserCreated(event)) return newUser(event);
    throw new Error('Unknown event');
};

const makeUser = (prev: User | undefined, events: EntityEvent[]): User => {
    const user = events.reduce(applyEvent, prev);
    if (!user) throw new Error('Unexpected error');
    const lastEvent = events[events.length - 1];
    user.revision = lastEvent.eventRevision;
    return user;
};

export { makeUser, commands };
