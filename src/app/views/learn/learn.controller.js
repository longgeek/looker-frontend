/**
 * Learn the controllers
 *
 * Functions (controllers)
 *  - LearnController
 */


/**
 * LearnController - List All Plan Course
 * used in learn list view
 */
function LearnController($scope, $auth, $state, $location, RestFul) {
    RestFul.error(
        {"action": "OnlineLearning:PlanRecommended", "params":{}},
        function(response) {
            if (response.hasOwnProperty('message')) {
                $scope.recommendedPlan = response.data;
            }
        }
    )
}

angular
    .module('appLooker')
    .controller('LearnController', LearnController)
