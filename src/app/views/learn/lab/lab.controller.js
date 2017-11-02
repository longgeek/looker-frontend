/**
 * Lab of labs controllers
 *
 * Functions (controllers)
 *  - LabListController
 *  - LabDetailController
 */


/**
 * LabListController - List All Labs
 * used in lab list view
 */
function LabListController($scope, RestFul) {
    $scope.labs_list = function() {
        RestFul.error(
            {"action": "OnlineLearning:Labs", "params": {}},
            function(response) {
                if (response.hasOwnProperty('message')) {
                    $scope.labs = response.data.labs;
                }
            }
        )
    }
}


/**
 * LabDetailController - Detail Lab
 * used in lab detail view
 */
function LabDetailController($scope, $auth, $stateParams, RestFul) {
    $scope.stateParams = angular.copy($stateParams);

    // Get the lab detail
    RestFul.error(
        {
            "action": "OnlineLearning:LabDetail",
            "params": {"lab": $scope.stateParams.ud}
        },
        function(response) {
            if (response) {
                $scope.lab = response.data;
                if ($auth.isAuthenticated()) {
                    // Get the Lab learn progress
                    RestFul.error(
                        {
                            "action": "LearningProgress:LabProgress",
                            "params": {"lab": $scope.stateParams.ud}
                        },
                        function(response) {
                            if (response.data) {
                                $scope.labProgress = response.data;
                            } else {
                                $scope.labProgress = '';
                            }
                        }
                    )
                }
            }
        }
    )
}

angular
    .module('appLooker')
    .controller('LabListController', LabListController)
    .controller('LabDetailController', LabDetailController)
