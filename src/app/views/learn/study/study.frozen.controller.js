/**
 * Learn the Study Frozen controllers
 *
 * Functions (controllers)
 *  - StudyFrozenController
 */


/**
 * StudyFrozenController
 * used in study-frozen.html view
 */
function StudyFrozenController($scope, $timeout, $uibModalInstance, $location, $rootScope, ipCookie) {
    var position = ipCookie("learnPosition");
    $scope.close = function () { $uibModalInstance.dismiss('cancel'); };

    $scope.reloadPage = function() {
        window.location.reload();
    }
    $scope.backLearnCourse = function() {
        $scope.close();
        if (!position.hasOwnProperty('origin') || !position.hasOwnProperty('source')) {
            url = "/learn";
        } else { url = "/learn/" + position.origin + "/detail/?ud=" + position.source[position.origin]; }

        $rootScope.remindLearn.status = false;
        $timeout(function() { $location.url(url); }, 300)
    }

}


angular
    .module('appLooker')
    .controller('StudyFrozenController', StudyFrozenController)
