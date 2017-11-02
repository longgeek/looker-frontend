/**
 * Profile Buylearning Controller
 *
 * Functions (controllers)
 *  - ProfileBuylearningController
 */

/**
 * ProfileBuylearningController
 * use login.html view
 */
function ProfileBuylearningController($scope, RestFul) {
    RestFul.error(
        {"action": "OnlineLearning:GetBuyLearningList", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message')) {
                $scope.buylearnings = response.data;
            }
        }
    )
}

angular
    .module('appLooker')
    .controller('ProfileBuylearningController', ProfileBuylearningController)
