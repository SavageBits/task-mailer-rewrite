// https://github.com/toddmotto/angularjs-styleguide
function TodoCtrl(todoSvc) {
    var vm = this; // capture context as vm which stands for View Model

    vm.data = todoSvc.loadTodos();

    vm.todos =  todoSvc.getTodos();
    vm.overdueTodos = todoSvc.getOverdueTodos();
    vm.futureTodos = todoSvc.getFutureTodos();
    vm.anytimeTodos = todoSvc.getAnytimeTodos();

    var createTodo = function() {
        todoSvc.createTodo(vm.description, vm.taskDate);

        vm.description = '';
    };

    var updateTodo = function(key, done) {
        todoSvc.updateTodo(key, done);
    };

    vm.createTodo = createTodo;
    vm.updateTodo = updateTodo;
}

angular
    .module('app')
    .controller('TodoCtrl', TodoCtrl);

