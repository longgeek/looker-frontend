/**
 * Course the tring topic controllers
 *
 * Functions (controllers)
 *  - FillinController
 */


/**
 * FillinController
 * used in fillin view
 */
function FillinController($scope, $timeout) {
    // // Listen the QA is open or close,
    // // auto set the slick the width.
    // $scope.$watch (function() {
    //         return $scope.showStudyQa;
    //     },
    //     function (newValue, oldValue) {
    //         if (newValue != oldValue) {
    //             $timeout(function() {
    //                 $(".slick-slider").slick('setPosition');
    //             }, 0);
    //         }
    //     }
    // );

    $scope.FillinData = {};
    if ($scope.task.topic_content) {
        for (i=0; i<$scope.task.topic_content.length; i++) {
            $scope.FillinData[i] = [];
        }
    }

    submitNumber = 0;
    $scope.fillinCheck = function() {
        if (!$scope.task.topic_content) { return; }
        if ($scope.fillin_form.$valid) {
            $scope.FillinLastData = angular.copy($scope.FillinData);
            $scope.FillinErrorList = {};
            for (i=0; i<$scope.task.topic_content.length; i++) {
                $scope.FillinErrorList[i] = [];
                for (j=0; j<Object.getOwnPropertyNames($scope.task.topic_content[i].answer).length; j++) {
                    if ($scope.FillinData[i][j] != $scope.task.topic_content[i].answer[j]) {
                        $scope.FillinErrorList[i].push(j);
                    }
                }
            }

            for (i=0; i<Object.getOwnPropertyNames($scope.FillinErrorList).length; i++) {
                if ($scope.FillinErrorList[i].length !== 0) {
                    $timeout(function() { $scope.showFillinError = false; }, 0);
                    $timeout(function() { $scope.showFillinError = true; }, 10);
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
            }
            if ($scope.showMiniWillDone || $scope.completed_tasks.indexOf($scope.task.uuid) !== -1) {
                $timeout(function() { $scope.showMiniWillDone = false; }, 0)
                $timeout(function() { $scope.showWillDone = true; }, 0)
                $timeout(function() { $scope.showWillDone = false; }, 1)
                $timeout(function() { $scope.showMiniWillDone = true; }, 300)
            } else { $scope.showWillDone = true; }
            $scope.showFillinSuccess = true;
            $scope.showFillinError = false;
            $scope.showTroubleHelp = false;
            $scope.gotIt();

        } else {
            $scope.fillin_form.submitted = true;
        }
    }
    $scope.continueToTry = function() {
        $scope.showTroubleHelp = !$scope.showTroubleHelp;
        submitNumber = 0;
    }
    $scope.getTroubleAnswer = function() {
        $scope.showFillinSuccess = false;
        $scope.showFillinError = false;
        $scope.showFillinAnswer = true;
        $scope.continueToTry();
    }
    $scope.fillinAnswerBack = function() {
        $scope.showFillinSuccess = false;
        $scope.showFillinError = true;
        $scope.showFillinAnswer = false;
    }
    $scope.fillinDisabledCheck = function() {
        for (i=0; i<Object.getOwnPropertyNames($scope.FillinData).length; i++) {
            for (j=0; j<$scope.FillinData[i].length; j++) {
                if ($scope.FillinLastData[i][j] !== $scope.FillinData[i][j]) { return false; }
            }
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
    .controller('FillinController', FillinController)
