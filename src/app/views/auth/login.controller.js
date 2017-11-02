/**
 * Login Controller
 *
 * Functions (controllers)
 *  - LoginController
 */

/**
 * LoginController - login controller
 * used in login view
 */
function LoginController($scope, $location, $auth, $timeout, $rootScope, RestFul, toaster) {
    $scope.loginForm = function() {
        if ($scope.login_form.$valid) {
            $scope.loginLoading = true;
            RestFul.error(
                {
                    'action': 'Auth:UserLogin',
                    'params': {
                        'account': $scope.username,
                        'password': $scope.password
                    }
                },
                function(response) {
                    if (!response) {
                        $scope.loginLoading = false;
                        return;
                    }
                    if (response.hasOwnProperty('message')) {
                        // save to token
                        $auth.setToken(response.data.access_token);
                        // check login status
                        RestFul.error(
                            {"action": "Auth:LoginStatus", "params": {}},
                            function(response) {
                                if (!response) {
                                    $scope.loginLoading = false;
                                    return;
                                }
                                if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                                    $scope.getUserInfo(response.data);
                                    $scope.get_global_notification_historys();
                                    $timeout(function() { $scope.get_global_notifications(); }, 1000);
                                    $timeout(function() { $scope.loginLoading = false; }, 0)

                                    // 登录跳转页面
                                    if ($rootScope.next_url) { $location.url($rootScope.next_url); }
                                    else {
                                        if (response.data.user.is_first_login) { $location.url('/learn'); }
                                        else { $location.url('/overview'); }
                                    }
                                } else if (response.hasOwnProperty('warning')) {
                                    toaster.error(response.warning);
                                } else if (response.hasOwnProperty('error')) {
                                    toaster.error(response.error);
                                }
                            }
                        )
                    } else if (response.hasOwnProperty('warning')) {
                        if (response.inner_code === 401) {
                            $scope.loginWarning = '';
                            $timeout(function() {
                                $scope.loginWarning = '用户名或密码错误';
                                $scope.loginWarningCode = response.inner_code;
                            }, 1000);
                        } else {
                            $scope.loginWarning = response.warning;
                            $scope.loginWarningCode = response.inner_code;
                        }
                        $timeout(function() { $scope.loginLoading = false; }, 1000)
                    }
                },
                function(error) {
                    $scope.loginLoading = false;
                    $scope.loginWarning = error.statusText;
                }
            )
        } else {
            $scope.login_form.submitted = true;
        }
    };
}

angular
    .module('appLooker')
    .controller('LoginController', LoginController)
