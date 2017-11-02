/**
 * PasswordReset Controller
 *
 * Functions (controllers)
 *  - PasswordResetController
 *  - PasswordResetConfirmController
 */

/**
 * PasswordResetController - password reset controller
 * used in password reset view
 */
function PasswordResetController($scope, $timeout, RestFul) {
    $scope.resetpassEmailForm = function() {
        if ($scope.resetpass_email_form.$valid) {
            $scope.resetPasswordLoading = true;
            RestFul.error(
                {"action": "Auth:AccountRetrieve", "params": {"email": $scope.resetpassEmail}},
                function(response) {
                    if (!response) {
                        $scope.resetPasswordLoading = false;
                        return;
                    }
                    if (response.hasOwnProperty('message')) {
                        $scope.resetPasswordLoading = false;
                        $scope.resetpassEmailSend = true;
                    } else if (response.hasOwnProperty('warning')) {
                        if (response.inner_code === 101) {
                            $scope.resetPasswordError = "请输入一个有效的邮箱地址.";
                        } else if (response.inner_code === 102) {
                            $scope.resetPasswordError = "邮箱不存在, 请重新输入.";
                        }
                    }
                    $scope.resetPasswordLoading = false;
                }

            )
        } else {
            $scope.resetpass_email_form.submitted = false;
            $timeout(function() {
                $scope.resetpass_email_form.submitted = true;
            }, 100)
        }
    }
}


/**
 * PasswordResetConfirmController - password reset confirm controller
 * used in password-reset-confirm view
 */
function PasswordResetConfirmController($scope, $location, $auth, $stateParams, RestFul) {
    $scope.resetpassConfirmForm = function() {
        if ($scope.resetpass_confirm_form.$valid) {
            $scope.resetpassLoading = true;
            RestFul.error(
                {
                    'action': 'Auth:AccountRetrieveConfirm',
                    'params': {
                        'identity': $stateParams.identity,
                        'password': $scope.resetpassPassword,
                    }
                },
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $scope.resetpassSuccess = true;
                    } else if (response.hasOwnProperty('warning')) {
                        if (response.inner_code === 101) {
                            $scope.resetpassError = "凭证已过期, 请重新发送验证邮件.";
                        } else if (response.inner_code === 102) {
                            $scope.resetpassError = "不是有效的凭证, 请重新发送验证邮件.";
                        }
                    }
                    $scope.resetpassLoading = false;
                }
            )
        } else {
            $scope.resetpass_confirm_form.submitted = true;
        }
    }
}


angular
    .module('appLooker')
    .controller('PasswordResetController', PasswordResetController)
    .controller('PasswordResetConfirmController', PasswordResetConfirmController)
