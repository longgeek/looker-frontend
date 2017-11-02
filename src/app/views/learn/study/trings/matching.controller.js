/**
 * Course the tring topic controllers
 *
 * Functions (controllers)
 *  - MatchingController
 */


/**
 * MatchingController
 * used in Matching view
 */
function MatchingController($scope, $timeout) {
    if ($scope.task.topic_content) {
        $scope.MatchingLeftItems = angular.copy($scope.task.topic_content[0].leftitems);
        $scope.MatchingRightItems = angular.copy($scope.task.topic_content[0].rightitems);
        $scope.MatchingLeftItems = $scope.MatchingLeftItems.sort(function(){
          return Math.random() - 0.5
        });
        $scope.MatchingRightItems = $scope.MatchingRightItems.sort(function(){
          return Math.random() + 0.5
        });
    } else {
        $scope.MatchingLeftItems = [];
        $scope.MatchingRightItems = [];
    }

    $scope.MatchingLastRightItems = angular.copy($scope.MatchingRightItems);

    submitNumber = 0;
    $scope.matchingCheck = function() {
        if (!$scope.task.topic_content) { return; }
        $scope.MatchingErrorList = [];
        $scope.MatchingLastRightItems = angular.copy($scope.MatchingRightItems);
        for (i=0; i<$scope.task.topic_content[0].leftitems.length; i++) {
            leftItemIndex = $scope.task.topic_content[0].leftitems.indexOf($scope.MatchingLeftItems[i]);
            rightItemContent = $scope.task.topic_content[0].rightitems[leftItemIndex];

            if ($scope.MatchingRightItems[i] !== rightItemContent) {
                $scope.MatchingErrorList.push(i);
            }
        }
        if ($scope.MatchingErrorList.length === 0) {
            if ($scope.showMiniWillDone || $scope.completed_tasks.indexOf($scope.task.uuid) !== -1) {
                $timeout(function() { $scope.showMiniWillDone = false; }, 0)
                $timeout(function() { $scope.showWillDone = true; }, 0)
                $timeout(function() { $scope.showWillDone = false; }, 1)
                $timeout(function() { $scope.showMiniWillDone = true; }, 300)
            } else { $scope.showWillDone = true; }
            $scope.showMatchingSuccess = true;
            $scope.showMatchingError = false;
            $scope.showTroubleHelp = false;
            $scope.gotIt();
        } else {
            $timeout(function() { $scope.showMatchingError = false; }, 0);
            $timeout(function() { $scope.showMatchingError = true; }, 0);
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
        $scope.showMatchingSuccess = false;
        $scope.showMatchingError = false;
        $scope.showMatchingAnswer = true;
        $scope.continueToTry();
    }
    $scope.matchingAnswerBack = function() {
        $scope.showMatchingSuccess = false;
        $scope.showMatchingError = true;
        $scope.showMatchingAnswer = false;
    }
    $scope.matchingDisabledCheck = function() {
        for (i=0; i<$scope.MatchingRightItems.length; i++) {
            value = $scope.MatchingRightItems[i];
            if ($scope.MatchingLastRightItems[i] !== value) { return false; }
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
    .controller('MatchingController', MatchingController)
