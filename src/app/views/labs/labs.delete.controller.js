/**
 * Lab of labs controllers
 *
 * Functions (controllers)
 *  - LabsDeleteController
 */


/**
 * LabsDeleteController - List All Labs
 * used in labs/create.html view
 */
function LabsDeleteController($scope, $timeout, $stateParams, $uibModalInstance, RestFul, replyInfo) {
    $scope.close = function () { $uibModalInstance.dismiss('cancel'); };
    console.log($scope.lab);

    $scope.submit_delete_reply = function() {
        RestFul.error(
            {
                "action": "OnlineLearning:JoinedLabDel",
                "params": {
                    "joinedlab": replyInfo.joinedlab,
                }
            },
            function (response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $timeout(function() {
                        $scope.submitLoading = false;
                        $scope.close();
                        $scope.globalTipsDialog("已删除");
                        delete $scope.$parent.my_labs.sorted[$scope.my_labs.sorted.indexOf(replyInfo.joinedlab)];
                        delete $scope.$parent.my_labs.values[replyInfo.joinedlab];
                        console.log($scope);
                    }, 300)
                }
                else if (response.hasOwnProperty('warning') && response.hasOwnProperty('inner_code')) {
                    if (response.inner_code === 1) {
                        $scope.submitLoading = false;
                        $scope.close();
                        $scope.globalTipsDialog("该评论已经被删除，无法继续删除，请刷新界面。");
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
    .controller('LabsDeleteController', LabsDeleteController)
