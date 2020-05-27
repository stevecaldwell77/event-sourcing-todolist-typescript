// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import { makeTodoList, commands } from '../src/entities/todo-list';
import getId from '../src/util/get-id';

test('makeTodoList: initial', (t) => {
    const listId = getId();
    const todoList = makeTodoList(
        undefined,
        commands.createList({
            userId: '1',
            listId,
            owner: '1',
            title: 'Test List',
        }),
    );
    t.deepEqual(
        todoList,
        {
            listId,
            owner: '1',
            revision: 1,
            items: [],
            title: 'Test List',
        },
        'initialized list looks correct',
    );
});

// create user
// call createTodoList use case
// call createTodoListItem use case
// call createTodoListItem use case
// call createTodoListItem use case
// call completeListItem use case
// call completeListItem use case
// call uncompleteListItem use case
// call getTodoList use case
// check list
