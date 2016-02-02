function CreateTodoForm() {
  return {
    templateUrl: "/views/todo/create-todo-form.html"
  }
}

angular
  .module('app')
  .directive('createTodoForm', CreateTodoForm);
