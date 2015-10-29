angular.module('app')
    .controller('todoCtrl', function($scope, todoSvc) {
        $scope.doIt = function() {
            //alert('hello');
            //var todoSvc = angular.module('app').service('todoSvc');

            //console.log(todoSvc);

            todoSvc.getTodos();
        }
    });
