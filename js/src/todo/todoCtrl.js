//angular.module('app')
//    .controller('todoCtrl', function($scope, todoSvc) {
//        $scope.doIt = function() {
//            //alert('hello');
//            //var todoSvc = angular.module('app').service('todoSvc');
//
//            //console.log(todoSvc);
//
//            //todos = todoSvc.getTodos();
//        };
//
//        //$scope.todos = function() {
//        //    alert('yiss');
//        //    return todoSvc.getTodos();
//        //};
//    });


// https://github.com/toddmotto/angularjs-styleguide
function TodoCtrl(todoSvc) {
    var vm = this; // capture context as vm which stands for View Model

    //this.doIt = function() {
    //    alert('hey');
    //}

    //vm.todos = ['a', 'b'];
    vm.data = todoSvc.loadTodos();
    vm.todos =  todoSvc.getTodos();
    //vm.data = todoSvc.getData();


    var doIt = function() {
        alert('hey');
    };

    vm.doIt = doIt;
}

angular
    .module('app')
    .controller('TodoCtrl', TodoCtrl);

