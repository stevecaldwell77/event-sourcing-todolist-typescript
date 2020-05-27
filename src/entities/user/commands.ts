import { makeEventUserCreated } from './events';

const createUser = (params: {
    commandUserId: string;
    userId: string;
    email: string;
}) => [
    makeEventUserCreated({
        eventUserId: params.commandUserId,
        userId: params.userId,
        email: params.email,
        eventRevision: 1,
    }),
];

export { createUser };
