/**
 * Profile intro Controller
 *
 * Functions (controllers)
 *  - ProfileIntroController
 */

/**
 * ProfileIntroController - profile intro controller
 * use intro.html view
 */
function ProfileIntroController($scope, $timeout, RestFul) {
    RestFul.global(
        {"action": "Account:UserProfile", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message')) {
                $scope.userProfile = response.data;
                $scope.intro = angular.copy($scope.userProfile.intro);
            }
        }
    )
    $scope.setintroForm = function() {
        if (!$scope.intro) { return; }
        if ($scope.intro.length > 64) {
            $scope.globalTipsDialog("个人简介不能超过 64 个字符");
            return;
        }
        $scope.introLoading = true;
        RestFul.error(
            {
                "action": "Account:SetUserInfo",
                "params": { "intro": $scope.intro, }
            },
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $scope.introLoading = false;
                    $scope.userProfile.intro = angular.copy($scope.intro);
                    $scope.globalTipsDialog("设置成功");
                }
            }
        )
    }
}

angular
    .module('appLooker')
    .controller('ProfileIntroController', ProfileIntroController)
