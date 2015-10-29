angular.module('app')
    .factory('todoSvc', function($firebaseObject) {
        return {
            addTodo: function() {

            },
            getTodos: function() {
                //alert('hello');
                var fbConnectionString = 'https://shining-inferno-6516.firebaseio.com/';
                var myDataRef = new Firebase(fbConnectionString + 'tasks');

                myDataRef.orderByChild("done").equalTo(false).on("child_added", function(task) {
                    alert(task);
                });
            }
        }
    });
