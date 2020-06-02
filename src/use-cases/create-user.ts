import { User, buildUser, commands } from 'src/entities/user';
import { Agent } from 'src/entities/agent';
import { SaveEvents, GetUserSourceData } from './types';
import runCommandAndSave from './run-command-and-save';
import getUser from './get-user';

export default async (params: {
    getUserSourceData: GetUserSourceData;
    saveEvents: SaveEvents;
    agent: Agent;
    userId: string;
    email: string;
}): Promise<User> =>
    runCommandAndSave({
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
