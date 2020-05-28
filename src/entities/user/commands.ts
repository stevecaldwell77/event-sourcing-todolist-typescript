import { Role } from 'src/shared/authorization';
import { makeEventUserCreated } from './events';

const createUser = (params: {
    commandUserId: string;
    userId: string;
    email: string;
    roles: Role[];
}) => [
    makeEventUserCreated({
        eventUserId: params.commandUserId,
        userId: params.userId,
        email: params.email,
        roles: params.roles,
        eventRevision: 1,
    }),
];

export { createUser };
