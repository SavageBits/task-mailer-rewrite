function TodoDb($firebaseObject) {
    var TodoDb = {};

    var fbUrl = 'https://shining-inferno-6516.firebaseio.com/';
    TodoDb.fbUrl = fbUrl;

    var fbTaskUrl = fbUrl + 'tasks/';
    TodoDb.fbTaskUrl = fbTaskUrl;

    TodoDb.todos = [];

    TodoDb.database = new Firebase(fbUrl + 'tasks');

    TodoDb.getTodos = function() {
        var self = this;

        return self.todos;
    };
    
    TodoDb.lastInsertedRecord = {};

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

    TodoDb.createTodo = function(taskDescription, taskDate, done, callback) {
        var self = this;

        self.lastInsertedRecord = self.database.push({
            description: taskDescription,
            date: taskDate,
            done: done
        },
        callback);        
    };

    TodoDb.updateTodo = function(key, done) {
        var self = this;

        var taskRef = new Firebase(self.fbTaskUrl + key);

        taskRef.child('done').set(done);
    };

    return TodoDb;
}

angular
    .module('app')
    .factory('todoDb', TodoDb);
