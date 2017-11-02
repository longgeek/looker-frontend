/**
 * Account History Controller
 *
 * Functions (controllers)
 *  - AccountHistoryController
 */

/**
 * AccountHistoryController
 * use history.html view
 */
function AccountHistoryController($scope, RestFul) {
    RestFul.global(
        {"action": "Account:MyTransactions", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message')) {
                $scope.bills = response.data.transactions;
            }
        }
    )
}

angular
    .module('appLooker')
    .controller('AccountHistoryController', AccountHistoryController)
