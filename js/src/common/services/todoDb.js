function TodoDb($firebaseObject) {
    var TodoDb = {};

    var fbUrl = 'https://shining-inferno-6516.firebaseio.com/';
    TodoDb.fbUrl = fbUrl;

    TodoDb.todos = [];

    TodoDb.database = new Firebase(fbUrl + 'tasks');

    TodoDb.doIt = function() {
        var self = this;
        //console.log('fbUrl: ' + self.fbUrl);
    };

    TodoDb.getTodos = function() {
        var self = this;

        return self.todos;
    };

    TodoDb.loadTodos = function(successFunction) {
        var self = this;

        self.database.orderByChild("done").equalTo(false).on("child_added", function(task) {
            self.todos.push(task);
            //console.log(task.val().description);
        });

        var databaseObject = $firebaseObject(self.database);

        databaseObject.$loaded().then(successFunction);

        return databaseObject;
    };

    return TodoDb;
}

angular
    .module('app')
    .factory('todoDb', TodoDb);
