/**
 * public tring controller
 *
 * Functions (controllers)
 *  - TringController
 */


/**
 * TringController - public contrller
 */
function TringController($scope, $location, $timeout, $uibModal, RestFul, ipCookie) {
    // Code Reset all files
    $scope.codeReset = function(type) {
        var tem = "app/views/learn/study/trings/reset.html";
        if (type === "django") { var tem = "app/views/learn/study/trings/reset-django.html"; }
        var uibModalInstance = $uibModal.open({
            templateUrl: tem,
            scope: $scope,
            backdrop: 'static',
            keyboard: false,
            size: 'sm',
            controller: 'ResetController',
        });
    }
    // Reset check list
    $scope.resetCheckLists = function() {
        RestFul.global(
            {"action": "WorkspaceCenter:ResetLesson", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $scope.loadTask({"task": ""});
                    $timeout(function() {
                        ipCookie.remove("completeCheckList", {'path': '/'});
                        $scope.completed_tasks.splice($scope.completed_tasks.indexOf($scope.taskSession.source.current_task_uuid), 1);
                    }, 500)
                }
            }
        )
    }
}


angular
    .module('appLooker')
    .controller('TringController', TringController)
