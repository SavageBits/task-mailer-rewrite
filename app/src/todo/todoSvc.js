//this is good but we're using firebase - http://stackoverflow.com/questions/21989300/calling-service-for-factory-in-controller

function TodoSvc($timeout, todoDb) {
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
        
        //really need to rethink this for document DB        
        if (null === task.date || '[any]' === task.date) {
          self.addTodoToList(task, self.anytimeTodos);
        }
        else {
          var taskDate = new Date(task.date);
          
          switch (getRelativeDayPosition(taskDate)) {
            case 'present':
              self.addTodoToList(task, self.todos);
              break;
            case 'past':
              self.addTodoToList(task, self.overdueTodos);
              break;
            case 'future':
              self.addTodoToList(task, self.futureTodos);
              break;
            default:           
              break;
          }  
        }                                            
    };
    
    TodoSvc.addTodoToList = function(task, list) {
        var self = this;

        list.push(task);
    };
    
    var getRelativeDayPosition = function(date) {
      var currentDate = new Date();
      
      if (moment(currentDate).isSame(date, 'day'))
            return 'present';
        else if (moment(currentDate).isAfter(date, 'day'))
            return 'past';
        else if (moment(currentDate).isBefore(date, 'day'))
            return 'future';
        else
            return 'none';
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

    TodoSvc.createTodo = function(taskDescription, taskDate) {
        var self = this;
      
        //for an "anytime" task, date can be null
        taskDate = taskDate == null ? null : taskDate.getTime();

        todoDb.createTodo(
          taskDescription, 
          taskDate, 
          false,
          function() {
            var insertedKey = todoDb.lastInsertedRecord.key();
            
            var task = {
              key: insertedKey,
              text: taskDescription,
              date: taskDate,
              done: false
            };
                        
            $timeout(function() {
              self.addTodo(task);  
            }, 0);                        
          }
        );                               
    };

    TodoSvc.updateTodo = function(key, done) {
        todoDb.updateTodo(key, done);
    };

    TodoSvc.loadTodos = function() {
        var self = this;

        //this has to be a callback/promise pattern - or does it? can binding save us here?
        var fbObject = todoDb.loadTodos(function() {
          todoDb.getTodos().forEach(function(task) {
            var taskToAdd = {
              key: task.key(),
              text: task.val().description,
              date: self.getTaskDateString(task.val().date),
              done: task.val().done
            };
            
            self.addTodo(taskToAdd);                
          });
        });

        return fbObject;
    };

    return TodoSvc;
}

angular
    .module('app')
    .factory('todoSvc', TodoSvc);
