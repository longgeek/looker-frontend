/**
 * Team Detail Controller
 *
 * Functions (controllers)
 *  - TeamDetailController
 */

/**
 * TeamDetailController - Team Detail controller
 * use detail.html view
 */
function TeamDetailController($scope, $timeout, $stateParams, RestFul) {
    if (!$stateParams.ud) { return; }
    $scope.teamDetailLoading = true;

    RestFul.error(
        {"action": "Account:TeamDetail", "params": {"team": $stateParams.ud}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                $scope.team = response.data;
                $timeout(function() { $scope.teamDetailLoading = false; }, 300)
            } else { $timeout(function() { $scope.teamDetailLoading = false; }, 300) }
        }
    )
}

angular
    .module('appLooker')
    .controller('TeamDetailController', TeamDetailController)
