/**
 * Profile Controller
 *
 * Functions (controllers)
 *  - ProfileController
 */

/**
 * ProfileController - profile password controller
 * use profile.html view
 */
function ProfileController($scope, $auth, RestFul) {
    RestFul.global(
        {"action": "Account:UserProfile", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message')) {
                $scope.userProfile = response.data;
                $scope.tags = [];
                tags = angular.copy($scope.userProfile.tags);
                if (tags.length > 0) {
                    for (i in tags.split(",")) {
                        val = tags.split(",")[i];
                        $scope.tags.push({"text": val});
                    }
                }
            }
        }
    )
}

angular
    .module('appLooker')
    .controller('ProfileController', ProfileController)
