function TaskCategoryList() {
    return {
      restrict: "A",
      scope: {
        taskType: "=",
        updateTodo: "="
      },
      templateUrl: "app/src/todo/task-category-list.html"
    };
}

angular
  .module('app')
  .directive('taskCategoryList', TaskCategoryList);
