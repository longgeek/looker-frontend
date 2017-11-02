/**
 * Profile Controller
 *
 * Functions (controllers)
 *  - ProfilePasswordController
 */

/**
 * ProfilePasswordController - profile password controller
 * use password.html view
 */
function ProfilePasswordController($scope, $auth, ipCookie, RestFul) {
    $scope.changePassForm = function() {
        if ($scope.change_pass_form.$valid) {
            RestFul.error(
                {
                    "action": "Account:ChangePassword",
                    "params": {
                        "old_password": $scope.old_pass,
                        "new_password": $scope.new_pass,
                    }
                },
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $scope.changePassSuccess = true;
                        RestFul.global(
                            {'action': 'Auth:UserLogout', 'params': {}},
                            function(response) {
                                $auth.logout().then(function() {
                                    ipCookie.remove('user', {'path': '/'});
                                });
                            }
                        )
                    } else {
                        $scope.changePassError = true;
                    }
                }
            )
        } else {
            $scope.change_pass_form.submitted = true;
        }
    }
}

angular
    .module('appLooker')
    .controller('ProfilePasswordController', ProfilePasswordController)
