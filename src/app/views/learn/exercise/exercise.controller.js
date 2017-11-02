/**
 * Exercise of exercises controllers
 *
 * Functions (controllers)
 *  - ExerciseListController
 *  - ExerciseDetailController
 */


/**
 * ExerciseListController - List All Exercises
 * used in exercise list view
 */
function ExerciseListController($scope, RestFul) {
    $scope.exercise_list = function() {
        RestFul.error(
            {"action": "OnlineLearning:Exercises", "params": {}},
            function(response) {
                if (response.hasOwnProperty('message')) {
                    $scope.exercises = response.data.exercises;
                }
            }
        )
    }
}


/**
 * ExerciseDetailController - Detail Exercise
 * used in exercise detail view
 */
function ExerciseDetailController($scope, $auth, $stateParams, RestFul) {
    $scope.stateParams = angular.copy($stateParams);

    // Get the exercise detail
    RestFul.error(
        {
            "action": "OnlineLearning:ExerciseDetail",
            "params": {"exercise": $scope.stateParams.ud}
        },
        function(response) {
            if (response) {
                $scope.exercise = response.data;
                if ($auth.isAuthenticated()) {
                    // Get the Exercise learn progress
                    RestFul.error(
                        {
                            "action": "LearningProgress:ExerciseProgress",
                            "params": {"exercise": $scope.stateParams.ud}
                        },
                        function(response) {
                            if (response.data) {
                                $scope.exerciseProgress = response.data;
                            } else {
                                $scope.exerciseProgress = '';
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
    .controller('ExerciseListController', ExerciseListController)
    .controller('ExerciseDetailController', ExerciseDetailController)
