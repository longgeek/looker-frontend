/**
 * Profile Email Controller
 *
 * Functions (controllers)
 *  - ProfileEmailController
 *  - ProfileEmailConfirmController
 *  - ProfileEmailCompleteController
 */

/**
 * ProfileEmailController
 * use email.html view
 */
function ProfileEmailController($scope, $timeout, RestFul) {
    $scope.verifyPasswdForm = function() {
        if ($scope.verify_passwd_form.$valid) {
            $timeout(function() {
                $scope.verifyPasswdLoading = true;
            }, 0)
            RestFul.error(
                {
                    "action": "Account:ChangeEmailSign",
                    "params": {
                        "password": $scope.password,
                    }
                },
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $scope.verifyPasswdSuccess = true;
                    }
                    else if (response.hasOwnProperty('warning')) {
                        if (response.inner_code === 400) {
                            $scope.verifyPasswdError = "旧密码验证失败, 请重新输入.";
                        } else {
                            $scope.verifyPasswdError = response.warning;
                        }
                    }
                    $scope.verifyPasswdLoading = false;
                }
            )
        } else {
            $scope.verify_passwd_form.submitted = true;
        }
    }
}

/**
 * ProfileEmailConfirmController
 */
function ProfileEmailConfirmController($scope, $timeout, $stateParams, RestFul) {
    $scope.verifyEmailForm = function() {
        if (!$stateParams.identity) {
            $scope.verifyEmailError = "身份信息没有通过验证，请重新尝试。";
            return;
        }
        if ($scope.verify_email_form.$valid) {
            $timeout(function() {
                $scope.verifyEmailLoading = true;
            }, 0)
            RestFul.error(
                {
                    "action": "Account:ChangeEmailApply",
                    "params": {
                        "new_email": $scope.email,
                        "identity": $stateParams.identity,
                    }
                },
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $scope.verifyEmailSuccess = true;
                    }
                    else if (response.hasOwnProperty('warning')) {
                        if (response.inner_code === 400) {
                            $scope.verifyEmailError = "邮箱已存在, 请重新输入.";
                        } else {
                            $scope.verifyEmailError = response.warning;
                        }
                    }
                    $scope.verifyEmailLoading = false;
                }
            )
        } else {
            $scope.verify_email_form.submitted = true;
        }
    }
}


/**
 * ProfileEmailCompleteController
 */
function ProfileEmailCompleteController($scope, $timeout, $state, $stateParams, RestFul) {
    if (!$state.includes("home.profile.email.complete")) {
        return;
    }
    if (!$stateParams.identity) {
        $scope.verifyCompleteError = "身份信息没有通过验证，请重新尝试。";
        return;
    }
    $timeout(function() {
        $scope.verifyCompleteLoading = true;
    }, 0)
    RestFul.error(
        {
            "action": "Account:ChangeEmailConfirm",
            "params": {
                "identity": $stateParams.identity,
            }
        },
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message')) {
                $scope.verifyCompleteSuccess = true;
            } else if (response.hasOwnProperty('warning')) {
                if (response.inner_code === 400) {
                    $scope.verifyCompleteError = "邮箱已存在, 请重新输入.";
                } else {
                    $scope.verifyCompleteError = response.warning;
                }
            }
            $scope.verifyCompleteLoading = false;
        }
    )
}

angular
    .module('appLooker')
    .controller('ProfileEmailController', ProfileEmailController)
    .controller('ProfileEmailConfirmController', ProfileEmailConfirmController)
    .controller('ProfileEmailCompleteController', ProfileEmailCompleteController)
