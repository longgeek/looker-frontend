/**
 * Moments Report Controller
 *
 * Functions (controllers)
 *  - MomentsReportController
 */

/**
 * MomentsReportController
 * use report.html view
 */
function MomentsReportController($scope, $timeout, $uibModalInstance, RestFul, momentReport) {
    $scope.close = function () { $uibModalInstance.dismiss('cancel'); };
    $scope.submitInfo = {"loading": false, "reason": ""};
    $scope.submitInfo.options = {
        "a": "垃圾营销",
        "b": "有害信息",
        "c": "违法信息",
        "d": "淫秽色情",
        "e": "人身攻击我",
        "f": "抄袭我的内容",
        "g": "泄露我的隐私",
    }
    $scope.submit_report_moment = function() {
        params = { "moment": momentReport.moment, "reason": $scope.submitInfo.reason};
        if (momentReport.reply_id) { params.reply_id = momentReport.reply_id; }

        $scope.submitInfo.loading = true;
        RestFul.global(
            {"action": "Moment:InformMomentOrReply", "params": params},
            function (response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $timeout(function() {
                        $scope.submitInfo.loading = false;
                        $scope.close();
                        $scope.globalTipsDialog("举报成功");
                    }, 300)
                }
                else if (response.hasOwnProperty('warning') && response.hasOwnProperty('inner_code')) {
                    if (response.inner_code === 1) {
                        $scope.submitInfo.loading = false;
                        $scope.close();
                        if (momentReport.reply_id) {
                            $scope.globalTipsDialog("该动态已被删除，无法举报，请刷新界面。");
                        } else {
                            $scope.globalTipsDialog("该评论已被删除，无法举报，请刷新界面。");
                        }
                    }
                }
                else {
                    toaster.error(response.message);
                    $scope.submitInfo.loading = false;
                }
            }
        )
    }
}

angular
    .module('appLooker')
    .controller('MomentsReportController', MomentsReportController)
