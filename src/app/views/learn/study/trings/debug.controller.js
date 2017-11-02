/**
 * Course the tring topic controllers
 *
 * Functions (controllers)
 *  - DebugController
 */


/**
 * DebugController
 * used in debug view
 */
function DebugController($scope, $timeout) {
    if ($scope.task.topic_content) {
        $scope.debugCode = angular.copy($scope.task.topic_content.content);
    }

    submitNumber = 0;
    $scope.debugCheck = function() {
        if (!$scope.task.topic_content) { return; }
        $scope.debugLastUserSelect = angular.copy($scope.debugUserSelect);
        if ($scope.debugUserSelect.length !== Object.getOwnPropertyNames($scope.task.topic_content.answer).length) {
            $timeout(function() { $scope.showDebugError = false; }, 0)
            $timeout(function() { $scope.showDebugError = true; }, 0)
            submitNumber += 1;
            if (submitNumber >= 3) {
                $scope.showTroubleHelp = true;
                $timeout(function() {
                    if ($scope.showMiniWillDone || $scope.completed_tasks.indexOf($scope.task.uuid) !== -1) {
                        angular.element(".study-footer-help").css("bottom", "90px");
                    }
                }, 100)
            }
            return;
        }
        for (i=0; i<$scope.debugUserSelect.length; i++) {
            if (!$scope.task.topic_content.answer.hasOwnProperty($scope.debugUserSelect[i])) {
                $timeout(function() { $scope.showDebugError = false; }, 0)
                $timeout(function() { $scope.showDebugError = true; }, 0)
                submitNumber += 1;
                if (submitNumber >= 3) {
                    $scope.showTroubleHelp = true;
                    $timeout(function() {
                        if ($scope.showMiniWillDone || $scope.completed_tasks.indexOf($scope.task.uuid) !== -1) {
                            angular.element(".study-footer-help").css("bottom", "90px");
                        }
                    }, 100)
                }
                break;
            } else {
                if ($scope.showMiniWillDone || $scope.completed_tasks.indexOf($scope.task.uuid) !== -1) {
                    $timeout(function() { $scope.showMiniWillDone = false; }, 0)
                    $timeout(function() { $scope.showWillDone = true; }, 0)
                    $timeout(function() { $scope.showWillDone = false; }, 1)
                    $timeout(function() { $scope.showMiniWillDone = true; }, 300)
                } else { $scope.showWillDone = true; }
                $scope.showDebugSuccess = true;
                $scope.showDebugError = false;
                $scope.showTroubleHelp = false;
                $scope.gotIt();
            }
        }
    }
    $scope.continueToTry = function() {
        $scope.showTroubleHelp = !$scope.showTroubleHelp;
        submitNumber = 0;
    }
    $scope.getTroubleAnswer = function() {
        $scope.showDebugSuccess = false;
        $scope.showDebugError = false;
        $scope.showDebugAnswer = true;
        $scope.continueToTry();
    }
    $scope.debugAnswerBack = function() {
        $scope.showDebugSuccess = false;
        $scope.showDebugError = true;
        $scope.showDebugAnswer = false;
    }

    $scope.debugUserSelect = [];
    $scope.debugContentSelect = function(index) {
        if ($scope.debugUserSelect.indexOf(index) !== -1) {
            $scope.debugUserSelect.splice($scope.debugUserSelect.indexOf(index), 1);
        } else { $scope.debugUserSelect.push(index); }
    }

    $scope.debugDisabledRecheck = function() {
        for (i=0; i<$scope.debugUserSelect.length; i++) {
            select = $scope.debugUserSelect[i];
            if ($scope.debugLastUserSelect[i] !== select) { return false; }
        }
        return true;
    }
    $scope.resetCheckLists = function() {
        $scope.loadTask({"task": ""});
        $scope.completed_tasks.splice($scope.completed_tasks.indexOf($scope.taskSession.source.current_task_uuid), 1);
    }
    // Code will done window to close
    $scope.closeWillDone = function() {
        $scope.showWillDone = !$scope.showWillDone;
        $scope.showMiniWillDone = !$scope.showMiniWillDone;
    }
}


angular
    .module('appLooker')
    .controller('DebugController', DebugController)
