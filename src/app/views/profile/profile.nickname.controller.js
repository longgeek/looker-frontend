/**
 * Profile Nickname Controller
 *
 * Functions (controllers)
 *  - ProfileNicknameController
 */

/**
 * ProfileNicknameController
 * use nickname.html view
 */
function ProfileNicknameController($scope, $timeout, RestFul) {
    if ($scope.userProfile && $scope.userProfile.nickname) {
        $scope.nickname = angular.copy($scope.userProfile.nickname);
    } else {
        RestFul.global(
            {"action": "Account:UserProfile", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $scope.userProfile = response.data;
                    $scope.nickname = angular.copy($scope.userProfile.nickname);
                }
            }
        )
    }
    $scope.setNicknameForm = function() {
        if ($scope.nickname_form.$valid) {
            $timeout(function() {
                $scope.setNicknameLoading = true;
            }, 0)
            RestFul.error(
                {
                    "action": "Account:SetUserInfo",
                    "params": {
                        "nickname": $scope.nickname,
                    }
                },
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $scope.setNicknameSuccess = true;
                        $scope.userProfile.nickname = angular.copy($scope.nickname);
                    } else if (response.hasOwnProperty('warning')) {
                        if (response.inner_code === 101) {
                            $scope.setNicknameError = "别名已被使用，请修改。";
                        } else {
                            $scope.setNicknameError = response.warning;
                        }
                    }
                    $scope.setNicknameLoading = false;
                }
            )
        } else {
            $scope.nickname_form.submitted = true;
        }
    }
}

angular
    .module('appLooker')
    .controller('ProfileNicknameController', ProfileNicknameController)
