/**
 * Moments Reply Delete Controller
 *
 * Functions (controllers)
 *  - MomentsReplyDeleteController
 */

/**
 * MomentsReplyDeleteController
 * use delete.html view
 */
function MomentsReplyDeleteController($scope, $timeout, $uibModalInstance, RestFul, replyInfo) {
    $scope.close = function () { $uibModalInstance.dismiss('cancel'); };
    $scope.submit_delete_reply = function() {
        $scope.submitLoading = true;
        RestFul.error(
            {
                "action": "Moment:RemoveReply",
                "params": {
                    "reply": replyInfo.reply,
                    "moment": replyInfo.moment,
                }
            },
            function (response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $timeout(function() {
                        $scope.submitLoading = false;
                        $scope.close();
                        $scope.moments.moments[replyInfo.moment_index].replies_count -= 1;
                        $scope.moments.moments[replyInfo.moment_index].replies.splice(replyInfo.reply_index, 1);
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
    .controller('MomentsReplyDeleteController', MomentsReplyDeleteController)
