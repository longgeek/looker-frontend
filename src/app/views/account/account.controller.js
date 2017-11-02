/**
 * Account Controller
 *
 * Functions (controllers)
 *  - AccountController
 */

/**
 * AccountController - User controller
 * use account.html view
 */
function AccountController($scope, $uibModal, $location, $window, RestFul) {
    $scope.getUserBalance();

    $scope.recharge = {"amount": 10, "bankcode": "alipay"};
    $scope.rechargeForm = function() {
        if ($scope.recharge.amount && $scope.recharge.bankcode) {
            if ($scope.recharge.amount >= 2 && $scope.recharge.amount <= 1500) {
                $scope.rechargeValueError = false;
                // Wait payment window
                var uibModalInstance = $uibModal.open({
                    templateUrl: 'app/views/account/wait-payment.html',
                    scope: $scope,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'sm',
                    controller: 'RechargeModalController',
                });
                angular.element("form[name=recharge_form]").submit();
            } else {
                $scope.rechargeValueError = true;
            }
        } else {
            $scope.rechargeValueError = true;
        }
    }
}

/**
 * AccountRechargeModal - Wait payment modal
 * use wait-payment.html view
 */
function RechargeModalController($scope, $state, $uibModalInstance, RestFul) {
    $scope.payCancel = function () {
        console.log('myBalance: ' + $scope.myBalance);
        console.log('recharge amount: ' + $scope.recharge.amount);
        $scope.getUserBalance();
        console.log('all: ' + $scope.myBalance);
        $uibModalInstance.dismiss('cancel');
    };

    $scope.paySuccess = function() {
        $uibModalInstance.dismiss('cancel');
        $state.go("home.account.history");
    }
}


/**
 * RechargeSuccessController - Wait payment modal
 * use recharge-success view
 */
function RechargeSuccessController($timeout, $location) {
    $timeout(function() { $location.url('/account/history'); }, 4000)
}

angular
    .module('appLooker')
    .controller('AccountController', AccountController)
    .controller('RechargeModalController', RechargeModalController)
    .controller('RechargeSuccessController', RechargeSuccessController)
