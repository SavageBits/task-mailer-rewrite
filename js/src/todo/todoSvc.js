//this is good but we're using firebase - http://stackoverflow.com/questions/21989300/calling-service-for-factory-in-controller

angular
    .module('app')
    .factory('todoSvc', function($http, $firebaseObject) {
        var TodoSvc = {};

        TodoSvc.todos = [];

        var fbUrl = 'https://shining-inferno-6516.firebaseio.com/';

        TodoSvc.database = new Firebase(fbUrl + 'tasks');


        TodoSvc.addTodo = function (task) {
            this.todos.push({
                key: task.key(),
                text: task.val().description,
                //date: taskDate.toDateString(),
                done: task.val().done
            })
        };

        TodoSvc.getTodos = function () {
            return this.todos;
        };

        TodoSvc.createTodo = function(description, date) {
            this.database.push({
                description: description,
                date: date,
                done: false
            });
        };

        TodoSvc.loadTodos = function() {
            //alert('hello');
            var self = this;

            this.database.orderByChild("done").equalTo(false).on("child_added", function(task) {
                self.addTodo(task);

                console.log(task.val().description);
            });

            //return self.todos;

            return  $firebaseObject(this.database);

//                console.log(self.todos);
        };

        return TodoSvc;
    });
