angular.module('app',["firebase"]);





//todo: add mail logic here; possibly move database access to common

function CreateTodoForm() {
  return {
    templateUrl: "views/todo/create-todo-form.html"
  }
}

angular
  .module('app')
  .directive('createTodoForm', CreateTodoForm);

function TaskCategoryList() {
    return {
      restrict: "A",
      scope: {
        taskType: "=",
        updateTodo: "="
      },
      templateUrl: "views/todo/task-category-list.html"
    };
}

angular
  .module('app')
  .directive('taskCategoryList', TaskCategoryList);

// https://github.com/toddmotto/angularjs-styleguide
TodoCtrl.$inject = ["todoSvc", "$scope"];
function TodoCtrl(todoSvc,$scope) {
    var vm = this; // capture context as vm which stands for View Model

    vm.data = todoSvc.loadTodos();

    vm.todos =  todoSvc.getTodos();
    vm.overdueTodos = todoSvc.getOverdueTodos();
    vm.futureTodos = todoSvc.getFutureTodos();
    vm.anytimeTodos = todoSvc.getAnytimeTodos();

    $scope.today = { name: 'today', todos: vm.todos };
    $scope.overdue = { name: 'overdue', todos: vm.overdueTodos };
    $scope.anytime = { name: 'anytime', todos: vm.anytimeTodos };

    var createTodo = function() {
        todoSvc.createTodo(vm.description, vm.taskDate);

        vm.description = '';
    };

    var updateTodo = function(key, done) {
        //console.log(key);
        todoSvc.updateTodo(key, done);
    };

    $scope.updateTodo = updateTodo;

    vm.createTodo = createTodo;
    vm.updateTodo = updateTodo;
}

angular
    .module('app')
    .controller('TodoCtrl', TodoCtrl);

//this is good but we're using firebase - http://stackoverflow.com/questions/21989300/calling-service-for-factory-in-controller

TodoSvc.$inject = ["todoDb"];
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


TodoDb.$inject = ["$firebaseObject"];function TodoDb($firebaseObject) {
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

    TodoDb.createTodo = function(taskDescription, taskDate, done) {
        var self = this;

        self.database.push({
            description: taskDescription,
            date: taskDate,
            done: done
        });
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
