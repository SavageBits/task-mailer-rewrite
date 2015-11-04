//this is good but we're using firebase - http://stackoverflow.com/questions/21989300/calling-service-for-factory-in-controller

angular
    .module('app')
    .factory('todoSvc', function($http, $firebaseObject) {
        var TodoSvc = {};

        TodoSvc.todos = [];
        TodoSvc.overdueTodos = [];

        var fbUrl = 'https://shining-inferno-6516.firebaseio.com/';

        TodoSvc.database = new Firebase(fbUrl + 'tasks');

        TodoSvc.addTodo = function(task) {
            var self = this;
            //possibly a good spot to bring in moment.js
            var currentDate = new Date();
            var currentDateString = currentDate.getDate() + '' + currentDate.getMonth() + '' + currentDate.getFullYear();

            var taskDate;
            var taskDateString = '';

            if (typeof task.val().date != 'undefined')
            {
                taskDate = new Date(task.val().date);
                taskDateString = taskDate.getDate() + '' + taskDate.getMonth() + '' + taskDate.getFullYear();
            }
            else
                taskDate = '[any]';

            if (currentDateString == taskDateString)
                self.addTodoToList(task, self.todos);
            else
                self.addTodoToList(task, self.overdueTodos);
        };

        TodoSvc.addTodoToList = function(task, list) {
            list.push({
                key: task.key(),
                text: task.val().description,
                //date: taskDate.toDateString(),
                done: task.val().done
            });
        };

        TodoSvc.getTodos = function () {
            return this.todos;
        };

        TodoSvc.getOverdueTodos = function() {
            return this.overdueTodos;
        };

        TodoSvc.createTodo = function(description, date) {
            this.database.push({
                description: description,
                date: date,
                done: false
            });
        };

        TodoSvc.loadTodos = function() {
            var self = this;

            this.database.orderByChild("done").equalTo(false).on("child_added", function(task) {
                self.addTodo(task);
            });

            return  $firebaseObject(self.database);
        };

        return TodoSvc;
    });
