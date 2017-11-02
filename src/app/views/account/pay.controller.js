/**
 * Account Controller
 *
 * Functions (controllers)
 *  - PayController
 */

/**
 * PayController - User controller
 * use pay.html view
 */
function PayController($scope, $http, $state, $timeout, $stateParams, RestFul, GLOBAL_VAR) {
    $scope.pay = {"amount": "", "order_id": ""};
    if ($stateParams.hasOwnProperty("order_id") && $stateParams.order_id) {
        $scope.payLoading = true;
        $scope.pay.order_id = angular.copy($stateParams.order_id);

        // Check the url params is valid.
        RestFul.error(
            {"action": "Account:OrderDetail", "params": {"order": $scope.pay.order_id}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                    if (response.data.uuid === $scope.pay.order_id) {
                        $scope.pay.status = true;
                        $scope.pay.amount = response.data.amount;
                        orderPolling();
                    } else { $scope.pay.status = false; }
                } else if (response.hasOwnProperty('warning')) {
                    if (response.inner_code === 1) { $scope.pay.status = false; }
                    else { $scope.pay.status = false; }
                } else { $scope.pay.status = false; }
                $timeout(function() { $scope.payLoading = false; }, 500)
            }
        )
    }

    // Polling to detect whether the payment is successful, and the jump page.
    function orderPolling() {
        $http({
            url: GLOBAL_VAR.wxpay_status,
            method: "GET",
        }).success(function(data) {
            if (data === "nopaid") { $timeout(function() { orderPolling(); }, 4000) }
            else { $state.go("home.success"); }
        }).error(function() { $timeout(function() { orderPolling(); }, 4000) })
    }
}

angular
    .module('appLooker')
    .controller('PayController', PayController)
