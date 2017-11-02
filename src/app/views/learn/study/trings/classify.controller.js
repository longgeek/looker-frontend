/**
 * Course the tring topic controllers
 *
 * Functions (controllers)
 *  - ClassifyController
 */


/**
 * ClassifyController
 * used in Classify view
 */
function ClassifyController($scope, $timeout) {
    if ($scope.task.topic_content) {
        $scope.ClassifyTypes = [];
        $scope.ClassifyItems = [];
        for (type in $scope.task.topic_content[0]) {
            if (type !== "$$hashKey") {
                $scope.ClassifyTypes.push(type);
                for (i=0; i<$scope.task.topic_content[0][type].length; i++) {
                    $scope.ClassifyItems.push($scope.task.topic_content[0][type][i]);
                }
            }
        }
        $scope.ClassifyData = {};
        for (i=0; i<$scope.ClassifyTypes.length; i++) {
            $scope.ClassifyData[$scope.ClassifyTypes[i]] = [];
        }

        $scope.sortableOptions = { connectWith: ".connectList" };

        $scope.ClassifyItems = $scope.ClassifyItems.sort(function() {
            return Math.random() - 0.5;
        });
    }

    submitNumber = 0;
    $scope.classifyCheck = function() {
        if (!$scope.task.topic_content) { return; }
        $scope.ClassifyLastData = angular.copy($scope.ClassifyData);
        $scope.ClassifyErrorList = [];
        for (type in $scope.task.topic_content[0]) {
            if (type !== "$$hashKey") {
                if ($scope.ClassifyData[type].length === $scope.task.topic_content[0][type].length) {
                    for (i=0; i<$scope.ClassifyData[type].length; i++) {
                        if ($scope.task.topic_content[0][type].indexOf($scope.ClassifyData[type][i]) === -1) {
                            $scope.ClassifyErrorList.push(type);
                            break;
                        }
                    }
                } else { $scope.ClassifyErrorList.push(type); }
            }
        }
        if ($scope.ClassifyErrorList.length === 0) {
            if ($scope.showMiniWillDone || $scope.completed_tasks.indexOf($scope.task.uuid) !== -1) {
                $timeout(function() { $scope.showMiniWillDone = false; }, 0)
                $timeout(function() { $scope.showWillDone = true; }, 0)
                $timeout(function() { $scope.showWillDone = false; }, 1)
                $timeout(function() { $scope.showMiniWillDone = true; }, 300)
            } else { $scope.showWillDone = true; }
            $scope.showClassifySuccess = true;
            $scope.showClassifyError = false;
            $scope.showTroubleHelp = false;
            $scope.gotIt();
        } else {
            $timeout(function() { $scope.showClassifyError = false; }, 0)
            $timeout(function() { $scope.showClassifyError = true; }, 0)
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
        $scope.showClassifySuccess = false;
        $scope.showClassifyError = false;
        $scope.showClassifyAnswer = true;
        $scope.continueToTry();
    }
    $scope.classifyAnswerBack = function() {
        $scope.showClassifySuccess = false;
        $scope.showClassifyError = true;
        $scope.showClassifyAnswer = false;
    }
    $scope.classifyDisabledCheck = function() {
        if (!$scope.task.topic_content) { return true; }
        for (type in $scope.ClassifyData) {
            if ($scope.ClassifyData[type].length === 0) { return true; }
        }
        return false;
    }
    $scope.classifyDisabledRecheck = function() {
        if (!$scope.task.topic_content) { return true; }
        for (type in $scope.ClassifyData) {
            if ($scope.ClassifyLastData[type].length === $scope.ClassifyData[type].length) {
                for (i=0; i<$scope.ClassifyLastData[type].length; i++) {
                    if ($scope.ClassifyData[type].indexOf($scope.ClassifyLastData[type][i]) === -1) { return false; }
                }
            } else { return false; }
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
    .controller('ClassifyController', ClassifyController)
