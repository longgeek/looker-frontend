/**
 * Profile Login Controller
 *
 * Functions (controllers)
 *  - ProfileLoginController
 */

/**
 * ProfileLoginController
 * use login.html view
 */
function ProfileLoginController($scope, RestFul) {
    RestFul.error(
        {"action": "Log:LoginLogoutLogs", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message')) {
                $scope.loginLogs = response.data;
            }
        }
    )
}

angular
    .module('appLooker')
    .controller('ProfileLoginController', ProfileLoginController)
