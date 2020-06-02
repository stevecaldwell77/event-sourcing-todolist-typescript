import { User, buildUser, commands } from 'src/entities/user';
import { Agent } from 'src/entities/agent';
import { EntityType } from 'src/lib/enums';
import { SaveEvents, GetUserSourceData } from './types';
import runCommandAndUpdate from './run-command-and-update';

export default async (params: {
    getUserSourceData: GetUserSourceData;
    saveEvents: SaveEvents;
    agent: Agent;
    userId: string;
    email: string;
}): Promise<User> =>
    runCommandAndUpdate({
        isCreateCommand: true,
        getSourceData: params.getUserSourceData,
        runCommand: () =>
            commands.createUser({
                agent: params.agent,
                userId: params.userId,
                email: params.email,
            }),
        saveEvents: params.saveEvents,
        buildEntity: buildUser,
        agent: params.agent,
        entityType: EntityType.User,
        entityId: params.userId,
    });
