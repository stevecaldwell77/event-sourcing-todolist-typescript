export enum Role {
    ADMIN = 'ADMIN',
}

export enum EntityType {
    TodoList = 'TodoList',
    User = 'User',
}

export enum EventName {
    LIST_CREATED = 'LIST_CREATED',
    LIST_ITEM_COMPLETED = 'LIST_ITEM_COMPLETED',
    LIST_ITEM_CREATED = 'LIST_ITEM_CREATED',
    LIST_ITEM_MOVED = 'LIST_ITEM_MOVED',
    LIST_ITEM_UNCOMPLETED = 'LIST_ITEM_UNCOMPLETED',
    USER_CREATED = 'USER_CREATED',
}
