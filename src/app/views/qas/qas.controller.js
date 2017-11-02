/**
 * Qas Controller
 *
 * Functions (controllers)
 *  - QasController
 */

/**
 * QasController - QAS controller
 * use qas.html view
 */
function QasController($scope, $state, $stateParams, $location, $timeout, $location, RestFul) {
    var params = {};
    if ($stateParams.pos) {
        if (isNaN(parseInt($stateParams.pos))) { $stateParams.pos = 1; }
        params.pos = parseInt($stateParams.pos);
    }

    $scope.qas_list = function(action, params) {
        if (action) { action = "MyQAs"; }
        else { action = "AllQAs"; }
        if (params == undefined) { params = {}; }

        $scope.qasLoading = true;
        RestFul.global(
            {"action": "Ticket:" + action, "params": params},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data) {
                        $timeout(function() {
                            $scope.qas = response.data;
                            $scope.qasLoading = false;
                        }, 300)
                    } else {
                        $scope.qas = [];
                        $scope.qasLoading = false;
                    }
                }
            }
        )
    }
    if ($state.is("home.qas")) { $scope.qas_list(false, params); }
    else { $scope.qas_list(true, params); }

    $scope.qas_pagination = function() {
        if ($state.is("home.qas")) {
            $scope.qas_list(false, {"pos": $scope.qas.paging.pos});
            $state.go("home.qas", {'pos': $scope.qas.paging.pos}, {notify: false});
        }
        else if ($state.is("home.qas.my")) {
            $scope.qas_list(true, {"pos": $scope.qas.paging.pos});
            $state.go("home.qas.my", {'pos': $scope.qas.paging.pos}, {notify: false});
        }
    }
}

angular
    .module('appLooker')
    .controller('QasController', QasController)
