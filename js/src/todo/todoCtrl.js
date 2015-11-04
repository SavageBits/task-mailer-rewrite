// https://github.com/toddmotto/angularjs-styleguide
function TodoCtrl(todoSvc) {
    var vm = this; // capture context as vm which stands for View Model

    vm.data = todoSvc.loadTodos();
    vm.todos =  todoSvc.getTodos();
    vm.overdueTodos = todoSvc.getOverdueTodos();
    vm.futureTodos = todoSvc.getFutureTodos();
    vm.anytimeTodos = todoSvc.getAnytimeTodos();

    var doIt = function() {
        alert('hey');
    };

    var createTodo = function() {
        todoSvc.createTodo(vm.description, vm.date);
    };

    var updateTodo = function(key, done) {
        todoSvc.updateTodo(key, done);
    };

    vm.doIt = doIt;
    vm.createTodo = createTodo;
    vm.updateTodo = updateTodo;
}

angular
    .module('app')
    .controller('TodoCtrl', TodoCtrl);

