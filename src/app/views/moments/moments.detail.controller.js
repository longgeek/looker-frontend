/**
 * Moments Detail Controller
 *
 * Functions (controllers)
 *  - Moments Detail Controller
 */

/**
 * MomentsDetailController
 * use detail.html view
 */
function MomentsDetailController($scope, $state, $rootScope, $stateParams, $timeout, RestFul) {
    if ($stateParams.ud) {
        if (isNaN(parseInt($stateParams.ud))) { return; }
    }
    $scope.get_moment_detail = function() {
        $scope.detailLoading = true;
        RestFul.error(
            {"action": "Moment:GetMomentDetail", "params": {"moment": parseInt($state.params.ud)}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                    $timeout(function() {
                        $scope.detailLoading = false;
                        $scope.moments.moments.push(response.data);
                        if (response.data.ctype === "post:tweet") {
                            $rootScope.pageData.title = response.data.content.substring(0, 10) + "... | 来自 " + response.data.created_by.nickname + " 的圈子 | 未来图谱";
                            $rootScope.pageData.description = response.data.content;
                        } else if (response.data.ctype === "learn:joined") {
                            $rootScope.pageData.title = "加入了一门新的课程" + " | 来自 " + response.data.created_by.nickname + " 的圈子 | 未来图谱";
                            $rootScope.pageData.description = response.data.created_by.nickname + "加入了一门新的课程：" + response.data.params.learn_name;
                        } else if (response.data.ctype === "learn:studying") {
                            $rootScope.pageData.title = "正在学习课程" + " | 来自 " + response.data.created_by.nickname + " 的圈子 | 未来图谱";
                            $rootScope.pageData.description = response.data.created_by.nickname + "正在学习课程：" + response.data.params.learn_name;
                        } else if (response.data.ctype === "learn:finished") {
                            $rootScope.pageData.title = "完成了一门课程" + " | 来自 " + response.data.created_by.nickname + " 的圈子 | 未来图谱";
                            $rootScope.pageData.description = response.data.created_by.nickname + "完成了一门课程：" + response.data.params.learn_name;
                        }
                    }, 100)
                } else { $scope.detailLoading = false; }
            }
        )
    }
    $scope.get_moment_detail();
}


angular
    .module('appLooker')
    .controller('MomentsDetailController', MomentsDetailController)
