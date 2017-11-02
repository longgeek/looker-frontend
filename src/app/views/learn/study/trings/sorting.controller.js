/**
 * Course the tring topic controllers
 *
 * Functions (controllers)
 *  - SortingController
 */


/**
 * SortingController
 * used in sorting view
 */
function SortingController($scope, $timeout) {
    if ($scope.task.topic_content) {
        $scope.sortingList = angular.copy($scope.task.topic_content[0].items);
        $scope.sortingList = $scope.sortingList.sort(function() {
            return Math.random() - 0.5;
        });
        var num = 0;
        for (i in $scope.task.topic_content[0].items) {
            if ($scope.sortingList[i] === $scope.task.topic_content[0].items[i]) {
                num += 1;
            }
        }
        if (num === $scope.task.topic_content[0].items.length) {
            $scope.sortingList = $scope.sortingList.sort(function() {
                return Math.random() - 0.5;
            });
        }
    } else {
        $scope.sortingList = [];
    }

    $scope.sortingLastList = angular.copy($scope.sortingList);

    submitNumber = 0;
    $scope.sortingCheck = function() {
        if (!$scope.task.topic_content) { return; }
        $scope.sortingResult = [];
        $scope.sortingLastList = angular.copy($scope.sortingList);
        for (i=0; i<$scope.task.topic_content[0].items.length; i++) {
            if ($scope.sortingList[i] !== $scope.task.topic_content[0].items[i]) {
                $scope.sortingResult.push(i);
            }
        }
        if ($scope.sortingResult.length === 0) {
            if ($scope.showMiniWillDone || $scope.completed_tasks.indexOf($scope.task.uuid) !== -1) {
                $timeout(function() { $scope.showMiniWillDone = false; }, 0)
                $timeout(function() { $scope.showWillDone = true; }, 0)
                $timeout(function() { $scope.showWillDone = false; }, 1)
                $timeout(function() { $scope.showMiniWillDone = true; }, 300)
            } else { $scope.showWillDone = true; }
            $scope.showSortingSuccess = true;
            $scope.showSortingError = false;
            $scope.showTroubleHelp = false;
            $scope.gotIt();
        } else {
            $timeout(function() { $scope.showSortingError = false; }, 0);
            $timeout(function() { $scope.showSortingError = true; }, 0);
            submitNumber += 1;
            if (submitNumber >= 3) {
                $scope.showTroubleHelp = true;
                $timeout(function() {
                    if ($scope.showMiniWillDone || $scope.completed_tasks.indexOf($scope.task.uuid) !== -1) {
                        angular.element(".study-footer-help").css("bottom", "90px");
                    }
                }, 100)
            }
        }
    }
    $scope.continueToTry = function() {
        $scope.showTroubleHelp = !$scope.showTroubleHelp;
        submitNumber = 0;
    }
    $scope.getTroubleAnswer = function() {
        $scope.showSortingSuccess = false;
        $scope.showSortingError = false;
        $scope.showSortingAnswer = true;
        $scope.continueToTry();
    }
    $scope.sortingAnswerBack = function() {
        $scope.showSortingSuccess = false;
        $scope.showSortingError = true;
        $scope.showSortingAnswer = false;
    }
    $scope.sortingDisabledCheck = function() {
        for (i=0; i<$scope.sortingList.length; i++) {
            value = $scope.sortingList[i];
            if ($scope.sortingLastList[i] !== value) { return false; }
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
    .controller('SortingController', SortingController)
