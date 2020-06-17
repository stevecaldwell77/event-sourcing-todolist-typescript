import autoBind from 'auto-bind';
import EventStore from 'src/event-management/event-store';
import { EntityType } from 'src/lib/enums';
import { MapToEntity, HasRevision } from 'src/entities/types';
import { EntityEvent } from 'src/entities/entity-event';
import { Agent } from 'src/entities/agent';
import { Authorization } from 'src/entities/authorization';
import { CreateCommand, Command } from 'src/entities/commands';

type BuildFromEvents<T> = {
    (prev: T | undefined, events: EntityEvent[]): T;
};

abstract class EventBasedEntityService<T extends HasRevision, U> {
    eventStore: EventStore;
    abstract entityType: EntityType;
    abstract buildFromEvents: BuildFromEvents<T>;
    abstract authorization: Authorization<T>;
    abstract createCommand: CreateCommand<T, U>;
    abstract mapToEntity: MapToEntity<T>;

    constructor(params: { eventStore: EventStore }) {
        this.eventStore = params.eventStore;
        autoBind(this);
    }

    async get(entityId: string, agent: Agent): Promise<T | undefined> {
        const { snapshot, events } = await this.eventStore.getEntitySourceData(
            this.entityType,
            this.mapToEntity,
            entityId,
        );
        if (events.length === 0) return undefined;
        const entity = this.buildFromEvents(snapshot, events);
        this.authorization.assertRead(agent, entity);
        return entity;
    }

    async getOrDie(entityId: string, agent: Agent): Promise<T> {
        const entity = await this.get(entityId, agent);
        if (!entity)
            throw new Error(
                `${this.constructor.name}.getOrDie(): ${entityId} does not exist`,
            );
        return entity;
    }

    private async _executeCommand(
        agent: Agent,
        commandName: string,
        run: () => EntityEvent[],
        entity?: T,
    ): Promise<T> {
        this.authorization.assertCommand(agent, commandName, entity);
        const events = run();
        await this.eventStore.saveEvents(events);
        return this.buildFromEvents(entity, events);
    }

    async create(entityId: string, agent: Agent, params: U): Promise<T> {
        const exists = await this.get(entityId, agent);
        if (exists)
            throw new Error(
                `${this.constructor.name}.create(): ${entityId} already exists`,
            );
        const run = () => this.createCommand.run(entityId, agent, params);
        return this._executeCommand(agent, this.createCommand.name, run);
    }

    async runCommand<V>(
        command: Command<T, V>,
        entity: T,
        agent: Agent,
        params: V,
    ): Promise<T> {
        const run = () => command.run(entity, agent, params);
        return this._executeCommand(agent, command.name, run, entity);
    }
}

export default EventBasedEntityService;
