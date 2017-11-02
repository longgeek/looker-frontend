/**
 * Moments Delete Controller
 *
 * Functions (controllers)
 *  - MomentsDeleteController
 */

/**
 * MomentsDeleteController
 * use delete.html view
 */
function MomentsDeleteController($scope, $timeout, $uibModalInstance, RestFul, momentInfo) {
    $scope.close = function () { $uibModalInstance.dismiss('cancel'); };
    $scope.submit_delete_moment = function() {
        $scope.submitLoading = true;
        RestFul.error(
            {"action": "Moment:RemoveMoment", "params": {"moment": momentInfo.moment}},
            function (response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $timeout(function() {
                        $scope.submitLoading = false;
                        $scope.close();
                        $scope.moments.moments.splice(momentInfo.index, 1);
                    }, 300)
                }
                else if (response.hasOwnProperty('warning') && response.hasOwnProperty('inner_code')) {
                    if (response.inner_code === 1) {
                        $scope.submitLoading = false;
                        $scope.close();
                        $scope.globalTipsDialog("该动态已被删除，无法继续删除，请刷新界面。");
                    }
                }
                else {
                    toaster.error(response.message);
                    $scope.submitLoading = false;
                }
            }
        )
    }
}

angular
    .module('appLooker')
    .controller('MomentsDeleteController', MomentsDeleteController)
