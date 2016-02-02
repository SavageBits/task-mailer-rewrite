//this is good but we're using firebase - http://stackoverflow.com/questions/21989300/calling-service-for-factory-in-controller

function TodoSvc(todoDb) {
    var TodoSvc = {};

    TodoSvc.todos = [];
    TodoSvc.overdueTodos = [];
    TodoSvc.futureTodos = [];
    TodoSvc.anytimeTodos = [];

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

    TodoSvc.createTodo = function(taskDescription, taskDate) {
        //for an "anytime" task, date can be null
        taskDate = taskDate == null ? null : taskDate.getTime();

        todoDb.createTodo(taskDescription, taskDate, false);
    };

    TodoSvc.updateTodo = function(key, done) {
        todoDb.updateTodo(key, done);
    };

    TodoSvc.loadTodos = function() {
        var self = this;

        //this has to be a callback/promise pattern - or does it? can binding save us here?
        var fbObject = todoDb.loadTodos(function() {
            todoDb.getTodos().forEach(function(task) {
                self.addTodo(task);                
            });
        });

        return fbObject;
    };

    return TodoSvc;
}

angular
    .module('app')
    .factory('todoSvc', TodoSvc);
