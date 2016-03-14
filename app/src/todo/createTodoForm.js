function CreateTodoForm() {
  return {
    templateUrl: "app/src/todo/create-todo-form.html"
  }
}

angular
  .module('app')
  .directive('createTodoForm', CreateTodoForm);
