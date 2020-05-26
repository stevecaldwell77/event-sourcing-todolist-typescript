import { Event } from '../event';
import { EntityType } from '../enums';

class EventTodoList extends Event {
    constructor(params: { userId: string; eventName: string; listId: string }) {
        super({
            eventName: params.eventName,
            entity: EntityType.TodoList,
            entityId: params.listId,
            userId: params.userId,
        });
    }
}

class EventListCreated extends EventTodoList {
    readonly payload: {
        title: string;
    };

    constructor(params: { userId: string; listId: string; title: string }) {
        super({
            eventName: 'LIST_CREATED',
            ...params,
        });
        this.payload = { title: params.title };
    }
}

class EventListItemCreated extends EventTodoList {
    readonly payload: {
        itemId: string;
        text: string;
    };

    constructor(params: {
        userId: string;
        listId: string;
        itemId: string;
        text: string;
    }) {
        super({
            eventName: 'LIST_ITEM_CREATED',
            ...params,
        });
        this.payload = {
            itemId: params.itemId,
            text: params.text,
        };
    }
}

class EventListItemCompleted extends EventTodoList {
    readonly payload: {
        itemId: string;
    };

    constructor(params: { userId: string; listId: string; itemId: string }) {
        super({
            eventName: 'LIST_ITEM_COMPLETED',
            ...params,
        });
        this.payload = { itemId: params.itemId };
    }
}

class EventListItemUncompleted extends EventTodoList {
    readonly payload: {
        itemId: string;
    };

    constructor(params: { userId: string; listId: string; itemId: string }) {
        super({
            eventName: 'LIST_ITEM_UNCOMPLETED',
            ...params,
        });
        this.payload = { itemId: params.itemId };
    }
}

class EventListItemMoved extends EventTodoList {
    readonly payload: {
        itemId: string;
        newPosition: number;
    };

    constructor(params: {
        userId: string;
        listId: string;
        itemId: string;
        newPosition: number;
    }) {
        super({
            eventName: 'LIST_ITEM_UNCOMPLETED',
            ...params,
        });
        this.payload = {
            itemId: params.itemId,
            newPosition: params.newPosition,
        };
    }
}

export {
    EventListCreated,
    EventListItemCreated,
    EventListItemCompleted,
    EventListItemUncompleted,
    EventListItemMoved,
};
