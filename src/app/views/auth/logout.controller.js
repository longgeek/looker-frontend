/**
 * Logout Controller
 *
 * Functions (controllers)
 *  - LogoutController
 */

/**
 * LogoutController - login controller
 * null view
 */
function LogoutController($scope, $rootScope, $location, $auth, $state, RestFul, ipCookie) {
    if ($scope.isAuthenticated()) {
        RestFul.global(
            {'action': 'Auth:UserLogout', 'params': {}},
            function(response) {
                $auth.logout().then(function() {
                    ipCookie.remove('user', {'path': '/'});
                    $state.go('auth.login');
                    if ($rootScope.socket) {
                        if ($rootScope.socket.connected) { $rootScope.socket.close(); };
                        $rootScope.socket = null;
                    };
                    if ($rootScope.remindLearn.status) { $rootScope.remindLearn.status = false; };
                });
            }
        )
    } else {
        ipCookie.remove('user', {'path': '/'});
        $state.go('auth.login');
    }
}

angular
    .module('appLooker')
    .controller('LogoutController', LogoutController)
