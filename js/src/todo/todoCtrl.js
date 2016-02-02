// https://github.com/toddmotto/angularjs-styleguide
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
