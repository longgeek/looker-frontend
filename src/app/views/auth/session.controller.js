/**
 * User Session Controller
 *
 * Functions (controllers)
 *  - SessionExpiredController
 */

/**
 * SessionExpiredController - User session expired controller
 * used in session-expired.html view
 */
function SessionExpiredController($scope, $auth, $state, $timeout, $location, ipCookie, $uibModalStack, $uibModalInstance) {
    $auth.logout().then(function() { ipCookie.remove('user', {path: '/'}); });
    $scope.cancel = function() { $uibModalInstance.dismiss('cancel'); }

    // jump to the login page
    $scope.relogin = function() {
        $uibModalInstance.dismiss('cancel');
        var openedModal = $uibModalStack.getTop();
        if (openedModal) { $uibModalStack.dismiss(openedModal.key); }
        $timeout(function() {
            $auth.logout().then(function() {
                $state.go("auth.login", {'next': $location.url()});
            });
        }, 300)
    }
}


angular
    .module('appLooker')
    .controller('SessionExpiredController', SessionExpiredController)
