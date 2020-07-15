import {
    assertUnknownEvent,
    entityBuilder,
} from 'src/event-management/entity-builder';
import {
    TodoListCreated,
    TodoListItemCreated,
    TodoListItemCompleted,
    TodoListItemUncompleted,
    TodoListItemMoved,
    TodoListEvent,
} from 'src/events/todo-list-events';
import { TodoList, newList, getItem } from 'src/entities/todo-list';

const handleListCreated = (event: TodoListCreated): TodoList =>
    newList({
        listId: event.collectionId,
        owner: event.payload.owner,
        title: event.payload.title,
    });

const handleItemCreated = (
    list: TodoList,
    event: TodoListItemCreated,
): TodoList => {
    list.items.push({
        itemId: event.payload.itemId,
        text: event.payload.text,
        completed: false,
    });
    return list;
};

const handleItemCompleted = (
    list: TodoList,
    event: TodoListItemCompleted,
): TodoList => {
    const item = getItem(list, event.payload.itemId);
    item.completed = true;
    return list;
};

const handleItemUncompleted = (
    list: TodoList,
    event: TodoListItemUncompleted,
): TodoList => {
    const item = getItem(list, event.payload.itemId);
    item.completed = false;
    return list;
};

const handleItemMoved = (
    list: TodoList,
    event: TodoListItemMoved,
): TodoList => {
    console.log(
        `tbd: moving items not implemented (event ${event.eventNumber})`,
    );
    return list;
};

const handleTodoListEvent = (
    list: TodoList | undefined,
    event: TodoListEvent,
): TodoList => {
    if (event instanceof TodoListCreated) return handleListCreated(event);
    if (!list) throw new Error(`${event.getEventName()} requires a TodoList`);

    if (event instanceof TodoListItemCreated)
        return handleItemCreated(list, event);
    if (event instanceof TodoListItemCompleted)
        return handleItemCompleted(list, event);
    if (event instanceof TodoListItemUncompleted)
        return handleItemUncompleted(list, event);
    if (event instanceof TodoListItemMoved) return handleItemMoved(list, event);

    return assertUnknownEvent(event);
};

export default entityBuilder({
    label: 'TodoList',
    eventHandler: handleTodoListEvent,
});
