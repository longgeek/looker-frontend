/**
 * Study RightBar Learn controllers
 *
 * Functions (controllers)
 *  - RightBarLearnController
 */


/**
 * RightBarLearnController
 * used in right-bar/learn.html view
 */
function RightBarLearnController($scope, RestFul) {
    RestFul.global(
        {"action": "LearningProgress:LastStudied", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message')) {
                $scope.lastLearn = response.data;
            }
        }
    )
}


angular
    .module('appLooker')
    .controller('RightBarLearnController', RightBarLearnController)
