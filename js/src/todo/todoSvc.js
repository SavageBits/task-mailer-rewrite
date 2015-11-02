//this is good but we're using firebase - http://stackoverflow.com/questions/21989300/calling-service-for-factory-in-controller

angular.module('app')
    .factory('todoSvc', function($http, $firebaseObject) {
        //var self = this;
        var TodoSvc = {};

        TodoSvc.todos = [];

        TodoSvc.addTodo = function(task) {
            this.todos.push({
                key: task.key(),
                text: task.val().description,
                //date: taskDate.toDateString(),
                done: task.val().done
            })
        };

        TodoSvc.getTodos = function() {
          return this.todos;
        };

        TodoSvc.loadTodos = function() {
            //alert('hello');
            var self = this;

            var fbConnectionString = 'https://shining-inferno-6516.firebaseio.com/';
            var myDataRef = new Firebase(fbConnectionString + 'tasks');

            myDataRef.orderByChild("done").equalTo(false).on("child_added", function(task) {
                self.addTodo(task);

                console.log(task.val().description);
            });

            //return self.todos;

            return  $firebaseObject(myDataRef);

//                console.log(self.todos);
        };

        return TodoSvc;
    });
