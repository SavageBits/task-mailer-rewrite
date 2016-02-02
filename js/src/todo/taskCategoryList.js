function TaskCategoryList() {
    return {
      restrict: "A",
      scope: {
        taskType: "=",
        updateTodo: "="
      },
      templateUrl: "/views/todo/task-category-list.html"
    };
}

angular
  .module('app')
  .directive('taskCategoryList', TaskCategoryList);
