/**
 * Lab of labs controllers
 *
 * Functions (controllers)
 *  - LabsController
 */


/**
 * LabsController - List All Labs
 * used in labs/labs.html view
 */
function LabsController($scope, RestFul) {
    $scope.labs_list = function() {
        RestFul.error(
            {"action": "OnlineLearning:Labs", "params": {}},
            function(response) {
                if (response.hasOwnProperty('message')) {
                    $scope.labs = response.data;
                    console.log($scope.labs);
                }
            }
        )
    }

    $scope.labs_list();
}
angular
    .module('appLooker')
    .controller('LabsController', LabsController)
