function TodoDb() {
    TodoDb.doIt = function() {
        console.log('oh hey');
    };

    return TodoDb;
}

angular
    .module('app')
    .factory("todoDb", TodoDb);
