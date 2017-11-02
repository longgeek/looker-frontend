/**
 * SignUp Controller
 *
 * Functions (controllers)
 *  - SignUpEmailController
 *  - SignUpConfirmController
 */

/**
 * SignUpEmailController - signup controller
 * used in signup view
 */
function SignUpEmailController($scope, $auth, $timeout, $stateParams, RestFul) {
    $scope.signupEmailForm = function() {
        if ($scope.signup_email_form.$valid) {
            params = {"email": $scope.SignUpEmail};
            if ($stateParams.code) {
                params.code = $stateParams.code;
            }
            $timeout(function() {
                $scope.signupLoading = true;
            }, 0);
            RestFul.error(
                {
                    'action': 'Auth:SignEmail',
                    'params': params,
                },
                function(response) {
                    if (!response) {
                        $scope.signupLoading = false;
                        return;
                    }
                    if (response.hasOwnProperty('message')) {
                        $scope.signupEmailSend = response.message;
                    } else if (response.hasOwnProperty('warning')) {
                        if (response.inner_code === 101) {
                            $scope.signupEmailWarning = "请输入一个有效的邮箱地址.";
                        } else if (response.inner_code === 102) {
                            $scope.signupEmailWarning = "邮箱已存在, 请重新输入.";
                        } else {
                            $scope.signupEmailWarning = response.warning;
                        }
                    }
                    $scope.signupLoading = false;
                }
            )
        } else {
            $scope.signup_email_form.submitted = true;
        }
    }
}


/**
 * SignUpConfirmController - signup confirm controller
 * used in signup-confirm view
 */
function SignUpConfirmController($scope, $location, $auth, $stateParams, $timeout, RestFul) {
    $scope.signupConfirmForm = function() {
        $timeout(function() {
            $scope.signupConfirmLoading = true;
            $scope.SignUpPassError = false;
            $scope.SignUpUserError = false;
        }, 0);
        if ($scope.signup_confirm_form.$valid) {
            RestFul.error(
                {
                    'action': 'Auth:RegisterUser',
                    'params': {
                        'identity': $stateParams.identity,
                        'username': $scope.SignUpUsername,
                        'password': $scope.SignUpPassword
                    }
                },
                function(response) {
                    if (response.hasOwnProperty('warning')) {
                        if (response.inner_code === 101) {
                            $scope.SignUpUserError = true;
                        } else if (response.inner_code === 102) {
                            $scope.SignUpPassError = "密码无效, 请重新输入。";
                        } else if (response.inner_code === 103) {
                            $scope.SignUpPassError = "邀请码无效，不能完成注册。";
                        } else if (response.inner_code === 104) {
                            $scope.SignUpPassError = "用户名已存在, 请重新输入。";
                        } else if (response.inner_code === 105) {
                            $scope.SignUpPassError = "注册码已过期, 请重新发送注册邮件。";
                        } else {
                            $scope.SignUpPassError = response.warning;
                        }
                        $scope.signupConfirmLoading = false;
                    } else if (response.hasOwnProperty('message')) {
                        RestFul.error(
                            {
                                'action': 'Auth:UserLogin',
                                'params': {
                                    'account': $scope.SignUpUsername,
                                    'password': $scope.SignUpPassword
                                }
                            },
                            function(response) {
                                if (response.hasOwnProperty('message')) {
                                    if (response.data.access_token) {
                                        // save to token
                                        $auth.setToken(response.data.access_token);
                                        // check login status
                                        RestFul.error(
                                            {"action": "Auth:LoginStatus", "params": {}},
                                            function(response) {
                                                if (!response.warning && !response.error) {
                                                    // save user info to cookies.
                                                    $scope.getUserInfo(response.data);
                                                    if (response.data.user.is_first_login) {
                                                        $location.url('/learn');
                                                    } else {
                                                        $location.url('/overview');
                                                    }
                                                }
                                            }
                                        )
                                    } else {
                                        $scope.loginError = true;
                                    }
                                } else if (response.hasOwnProperty('warning')) {
                                    $scope.loginEd = true;
                                }
                                $scope.signupConfirmLoading = false;
                            }
                        )
                    } else {
                        $scope.SignUpPassError = response.warning;
                        $scope.signupConfirmLoading = false;
                    }
                }
            )
        } else {
            $scope.signup_confirm_form.submitted = true;
            $timeout(function() {
                $scope.signupConfirmLoading = false;
            }, 0);
        }
    }
}

angular
    .module('appLooker')
    .controller('SignUpEmailController', SignUpEmailController)
    .controller('SignUpConfirmController', SignUpConfirmController)
