/**
 * Profile Operate Controller
 *
 * Functions (controllers)
 *  - ProfileOperateController
 */

/**
 * ProfileOperateController
 * use operate.html view
 */
function ProfileOperateController($scope, RestFul) {
    RestFul.global(
        {"action": "Log:OperationLogs", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message')) {
                $scope.operateLogs = response.data;
            }
        }
    )
}

angular
    .module('appLooker')
    .controller('ProfileOperateController', ProfileOperateController)
