import { Role } from 'src/entities/authorization';
import buildUser from './user/build';
import * as commands from './user/commands';

export interface User {
    userId: string;
    email: string;
    revision: number;
    roles: Role[];
}

const newUser = (params: { userId: string; email: string }): User => ({
    revision: 1,
    userId: params.userId,
    email: params.email,
    roles: [],
});

export { buildUser, commands, newUser };
