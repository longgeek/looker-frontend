/**
 * Course the tring topic controllers
 *
 * Functions (controllers)
 *  - ChoiceController
 */


/**
 * ChoiceController
 * used in choice view
 */
function ChoiceController($scope, $timeout) {

    // Listen the QA is open or close,
    // auto set the slick the width.
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

    submitNumber = 0;
    $scope.choiceCheck = function() {
        if (!$scope.task.topic_content) { return; }
        $scope.ChoiceLastData = angular.copy($scope.ChoiceData);
        $scope.choiceCheckErrorList = [];
        for (i=0; i<$scope.task.topic_content.length; i++) {
            if ($scope.ChoiceData[i].length !== $scope.task.topic_content[i].answer.length) {
                $scope.choiceCheckErrorList.push(i);
            } else {
                for (j=0; j<$scope.task.topic_content[i].answer.length; j++) {
                    if ($scope.ChoiceData[i].join('').indexOf($scope.task.topic_content[i].answer[j].toLocaleUpperCase()) === -1 ){
                        $scope.choiceCheckErrorList.push(i);
                    }
                }
            }
        }
        if ($scope.choiceCheckErrorList.length === 0) {
            if ($scope.showMiniWillDone || $scope.completed_tasks.indexOf($scope.task.uuid) !== -1) {
                $timeout(function() { $scope.showMiniWillDone = false; }, 0)
                $timeout(function() { $scope.showWillDone = true; }, 0)
                $timeout(function() { $scope.showWillDone = false; }, 1)
                $timeout(function() { $scope.showMiniWillDone = true; }, 300)
            } else { $scope.showWillDone = true; }
            $scope.showChoiceSuccess = true;
            $scope.showChoiceError = false;
            $scope.showTroubleHelp = false;
            $scope.gotIt();
        } else {
            $timeout(function() { $scope.showChoiceError = false; }, 0)
            $timeout(function() { $scope.showChoiceError = true; }, 0)
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
        $scope.showChoiceSuccess = false;
        $scope.showChoiceError = false;
        $scope.showChoiceAnswer = true;
        $scope.continueToTry();
    }
    $scope.choiceAnswerBack = function() {
        $scope.showChoiceSuccess = false;
        $scope.showChoiceError = true;
        $scope.showChoiceAnswer = false;
    }

    $scope.ChoiceData = {};
    if ($scope.task.topic_content) {
        for (i=0; i<$scope.task.topic_content.length; i++) { $scope.ChoiceData[i] = []; }
    }
    $scope.choiceOptionClick = function(option, index) {
        if ($scope.ChoiceData[index].indexOf(option) === -1) {
            $scope.ChoiceData[index].push(option);
        } else {
            $scope.ChoiceData[index].splice($scope.ChoiceData[index].indexOf(option), 1);
        }
    }
    $scope.choiceDisabledCheck = function() {
        if (!$scope.task.topic_content) { return true; }
        if ($scope.task.topic_content) {
            for (i=0; i<$scope.task.topic_content.length; i++) {
                if ($scope.ChoiceData[i] === undefined || $scope.ChoiceData[i].length === 0) { return true; }
            }
        } else { return true; }
    }
    $scope.choiceDisabledRecheck = function() {
        for (i=0; i<$scope.choiceCheckErrorList.length; i++) {
            index = $scope.choiceCheckErrorList[i];
            if ($scope.ChoiceData[index].length === 0) { return true; }
            if ($scope.ChoiceLastData[index].join('') !== $scope.ChoiceData[index].join('')) { return false; }
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
    .controller('ChoiceController', ChoiceController)
