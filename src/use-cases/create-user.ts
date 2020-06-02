import { User, buildUser, commands } from 'src/entities/user';
import { Agent } from 'src/entities/agent';
import { SaveEvents, GetUserSourceData } from './types';
import runCommandAndUpdate from './run-command-and-update';
import getUser from './get-user';

export default async (params: {
    getUserSourceData: GetUserSourceData;
    saveEvents: SaveEvents;
    agent: Agent;
    userId: string;
    email: string;
}): Promise<User> =>
    runCommandAndUpdate({
        isCreateCommand: true,
        getEntity: () =>
            getUser({
                getUserSourceData: params.getUserSourceData,
                agent: params.agent,
                userId: params.userId,
            }),
        runCommand: () =>
            commands.createUser({
                agent: params.agent,
                userId: params.userId,
                email: params.email,
            }),
        saveEvents: params.saveEvents,
        buildEntity: buildUser,
        agent: params.agent,
        label: 'createUser',
    });
