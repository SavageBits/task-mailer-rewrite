function TodoCtrl($scope, todoSvc) {
    var vm = this; // capture context as vm which stands for View Model

    vm.data = todoSvc.loadTodos();

    $scope.today = { name: 'today', todos: todoSvc.getTodos() };
    $scope.overdue = { name: 'overdue', todos: todoSvc.getOverdueTodos() };
    $scope.anytime = { name: 'anytime', todos: todoSvc.getAnytimeTodos() };

    vm.futureTodos = todoSvc.getFutureTodos();

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
