//this is good but we're using firebase - http://stackoverflow.com/questions/21989300/calling-service-for-factory-in-controller

angular
    .module('app')
    .factory('todoSvc', function($http, $firebaseObject) {
        var TodoSvc = {};

        TodoSvc.todos = [];
        TodoSvc.overdueTodos = [];
        TodoSvc.futureTodos = [];
        TodoSvc.anytimeTodos = [];

        var fbUrl = 'https://shining-inferno-6516.firebaseio.com/';

        TodoSvc.database = new Firebase(fbUrl + 'tasks');

        TodoSvc.addTodo = function(task) {
            var self = this;

            var currentDate = new Date();
            var taskDate = new Date(task.val().date);

            //todo: move into a function that returns the list we should add the task to
            if (moment(currentDate).isSame(taskDate, 'day'))
                self.addTodoToList(task, self.todos);
            else if (moment(currentDate).isAfter(taskDate, 'day'))
                self.addTodoToList(task, self.overdueTodos);
            else if (moment(currentDate).isBefore(taskDate, 'day'))
                self.addTodoToList(task, self.futureTodos);
            else
                self.addTodoToList(task, self.anytimeTodos);
        };

        TodoSvc.getTaskDateString = function(taskDate) {
            var taskDateString = '';

            if (typeof taskDate != 'undefined')
            {
                taskDate = new Date(taskDate);
                taskDateString = taskDate.toDateString();
            }
            else
                taskDateString = '[any]';

            return taskDateString;
        };

        TodoSvc.addTodoToList = function(task, list) {
            var self = this;

            list.push({
                key: task.key(),
                text: task.val().description,
                date: self.getTaskDateString(task.val().date),
                done: task.val().done
            });
        };

        TodoSvc.getTodos = function () {
            //should this be var self = this; return self.todos;?
            return this.todos;
        };

        TodoSvc.getOverdueTodos = function() {
            return this.overdueTodos;
        };

        TodoSvc.getFutureTodos = function() {
            return this.futureTodos;
        };

        TodoSvc.getAnytimeTodos = function() {
            return this.anytimeTodos;
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

            return $firebaseObject(self.database);
        };

        return TodoSvc;
    });
