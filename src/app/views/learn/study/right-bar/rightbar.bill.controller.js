/**
 * Study RightBar Bill controllers
 *
 * Functions (controllers)
 *  - RightBarBillController
 */


/**
 * RightBarBillController
 * used in right-bar/bill.html view
 */
function RightBarBillController($scope, RestFul) {
    RestFul.global(
        {"action": "Account:MyTransactions", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty("message")) {
                $scope.studyRightBills = response.data.transactions;
            }
        }
    )
}


angular
    .module('appLooker')
    .controller('RightBarBillController', RightBarBillController)
