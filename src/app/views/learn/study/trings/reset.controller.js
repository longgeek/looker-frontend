/**
 * topic reset code files.
 *
 * Functions (controllers)
 *  - ResetController
 */


/**
 * ResetController - reset modal controller
 * used in django-reset.html and reset.html view
 */
function ResetController($scope, $location, $timeout, $uibModalStack, $uibModalInstance, RestFul, ipCookie) {
    $scope.cancel = function() { $uibModalInstance.dismiss('cancel'); }
    $scope.resetConfirm = function() {
        $timeout(function() { $scope.study_quit = 'reseting'; }, 0)
        RestFul.global(
            {"action": "WorkspaceCenter:ResetLesson", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $timeout(function() { $scope.study_quit = true; }, 1000)
                    $timeout(function() {
                        var openedModal = $uibModalStack.getTop();
                        if (openedModal) { $scope.resetAction(); }
                    }, 4000)
                }
            }
        )
    }
    $scope.resetAction = function() {
        ipCookie.remove("completeCheckList", {'path': '/'});
        $scope.cancel();
        $scope.loadTask({"task": ""});
        $timeout(function() {
            if ($scope.completed_tasks.indexOf($scope.task.uuid) !== -1) {
                $scope.completed_tasks.splice($scope.completed_tasks.indexOf($scope.taskSession.source.current_task_uuid), 1);
            }
        }, 500)
    }
}


angular
    .module('appLooker')
    .controller('ResetController', ResetController)
