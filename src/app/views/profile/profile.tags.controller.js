/**
 * Profile tags Controller
 *
 * Functions (controllers)
 *  - ProfileTagsController
 */

/**
 * ProfileTagsController - profile tags controller
 * use tags.html view
 */
function ProfileTagsController($scope, $timeout, RestFul) {
    $scope.settagsForm = function() {
        if (!$scope.tags) { return; }
        if ($scope.tags.length > 5) {
            $scope.globalTipsDialog("最多可以设置 10 个标签");
            return;
        }
        $scope.tagsLoading = true;
        tags = [];
        for (i in $scope.tags) {
            val = $scope.tags[i].text;
            tags.push(val);
        }
        RestFul.error(
            {
                "action": "Account:SetUserInfo",
                "params": {
                    "tags": tags.join(','),
                }
            },
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $timeout(function() {
                        $scope.tagsLoading = false;
                        $scope.globalTipsDialog("设置成功");
                    }, 300)
                }
            }
        )
    }
}

angular
    .module('appLooker')
    .controller('ProfileTagsController', ProfileTagsController)
