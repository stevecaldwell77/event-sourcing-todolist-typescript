import autoBind from 'auto-bind';
import { IEvent } from 'src/event-management/event';
import { CreateCommand, Command } from 'src/event-management/command';
import EventStore, {
    AssertEntity,
    IEntity,
} from 'src/event-management/event-store';

export type Authorization<TAgent, TEntity> = {
    assertRead: (agent: TAgent, entity: TEntity) => void;
    assertCommand: (agent: TAgent, command: string, entity?: TEntity) => void;
};

type BuildFromEvents<TEntity extends IEntity, TEvent extends IEvent> = {
    (prev: TEntity | undefined, events: TEvent[]): TEntity;
};

type IsEntityEvent<TEvent extends IEvent, TEntityEvent extends TEvent> = {
    (event: TEvent): event is TEntityEvent;
};

abstract class EntityService<
    TEntity extends IEntity,
    TCreateCommandParams,
    TEvent extends IEvent,
    TEntityEvent extends TEvent,
    TAgent
> {
    eventStore: EventStore<TEvent>;
    abstract collectionType: string;
    abstract isEntityEvent: IsEntityEvent<TEvent, TEntityEvent>;
    abstract buildFromEvents: BuildFromEvents<TEntity, TEntityEvent>;
    abstract assertEntity: AssertEntity<TEntity>;
    abstract authorization: Authorization<TAgent, TEntity>;
    abstract createCommand: CreateCommand<TEvent, TAgent, TCreateCommandParams>;

    constructor(params: { eventStore: EventStore<TEvent> }) {
        this.eventStore = params.eventStore;
        autoBind(this);
    }

    coerceToEntityEvents(events: TEvent[]): TEntityEvent[] {
        return events.map((event) => {
            if (!this.isEntityEvent(event))
                throw new Error(
                    `Unexpected event found: ${event.getEventName()}`,
                );
            return event;
        });
    }

    _buildFromEvents(prev: TEntity | undefined, events: TEvent[]): TEntity {
        const entityEvents = this.coerceToEntityEvents(events);
        return this.buildFromEvents(prev, entityEvents);
    }

    async get(entityId: string, agent: TAgent): Promise<TEntity | undefined> {
        const { snapshot, events } = await this.eventStore.getEntitySourceData(
            this.collectionType,
            this.assertEntity,
            entityId,
        );
        if (events.length === 0) return undefined;
        const entity = this._buildFromEvents(snapshot, events);
        this.authorization.assertRead(agent, entity);
        return entity;
    }

    async getOrDie(entityId: string, agent: TAgent): Promise<TEntity> {
        const entity = await this.get(entityId, agent);
        if (!entity)
            throw new Error(
                `${this.constructor.name}.getOrDie(): ${entityId} does not exist`,
            );
        return entity;
    }

    private async _executeCommand(params: {
        agent: TAgent;
        commandName: string;
        entity?: TEntity;
        prevEventNumber: number;
        run: () => TEvent[];
    }): Promise<TEntity> {
        this.authorization.assertCommand(
            params.agent,
            params.commandName,
            params.entity,
        );
        const events = params.run();

        let eventNumber = params.prevEventNumber;
        for (const event of events) {
            eventNumber += 1;
            event.eventNumber = eventNumber;
        }

        await this.eventStore.saveEvents(events);
        return this._buildFromEvents(params.entity, events);
    }

    async create(
        entityId: string,
        agent: TAgent,
        params: TCreateCommandParams,
    ): Promise<TEntity> {
        const exists = await this.get(entityId, agent);
        if (exists)
            throw new Error(
                `${this.constructor.name}.create(): ${entityId} already exists`,
            );
        const run = () => this.createCommand.run(entityId, agent, params);
        return this._executeCommand({
            agent,
            commandName: this.createCommand.name,
            prevEventNumber: 0,
            run,
        });
    }

    async runCommand<TParams>(
        command: Command<TEvent, TAgent, TEntity, TParams>,
        entity: TEntity,
        agent: TAgent,
        params: TParams,
    ): Promise<TEntity> {
        const run = () => command.run(entity, agent, params);
        return this._executeCommand({
            agent,
            commandName: command.name,
            entity,
            prevEventNumber: entity.revision,
            run,
        });
    }
}

export default EntityService;
