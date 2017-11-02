/**
 * Team Controller
 *
 * Functions (controllers)
 *  - TeamController
 */

/**
 * TeamController - Team controller
 * use team.html view
 */
function TeamController($scope, $timeout, RestFul) {
    $scope.teamLoading = true;

    RestFul.error(
        {"action": "Account:TeamList", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                $timeout(function() {
                    $scope.teams = response.data;
                    $scope.teamLoading = false;
                }, 500)
            } else { $timeout(function() { $scope.teamLoading = false; }, 300) }
        }
    )
}

angular
    .module('appLooker')
    .controller('TeamController', TeamController)
