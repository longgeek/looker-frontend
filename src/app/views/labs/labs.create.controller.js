/**
 * Lab of labs controllers
 *
 * Functions (controllers)
 *  - LabsCreateController
 */


/**
 * LabsCreateController - List All Labs
 * used in labs/create.html view
 */
function LabsCreateController($scope, $timeout, $stateParams, $uibModalInstance, RestFul) {
    $scope.close = function () { $uibModalInstance.dismiss('cancel'); };
    console.log($scope.lab);

    $scope.submit_delete_reply = function() {
        RestFul.error(
            {
                "action": "OnlineLearning:JoinedLabNew",
                "params": {
                    "lab": $stateParams.ud,
                    "name": "Fuvism_" + Math.random(),
                }
            },
            function (response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $timeout(function() {
                        $scope.submitLoading = false;
                        $scope.close();
                        $scope.globalTipsDialog("正在加入实验中");
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
    .controller('LabsCreateController', LabsCreateController)
