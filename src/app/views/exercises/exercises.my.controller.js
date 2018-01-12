/**
 * Exercises my controllers
 *
 * Functions (controllers)
 *  - ExercisesMyController
 */


/**
 * ExercisesMyController - My Exercises List
 * used in exercises/my.html view
 */
function ExercisesMyController($scope, RestFul) {
    // $scope.exercises_list = function() {
    //     RestFul.error(
    //         {"action": "OnlineLearning:Exercises", "params": {}},
    //         function(response) {
    //             if (response.hasOwnProperty('message')) {
    //                 $scope.exercises = response.data;
    //                 console.log($scope.exercises);
    //             }
    //         }
    //     )
    // }

    // $scope.exercises_list();
}
angular
    .module('appLooker')
    .controller('ExercisesMyController', ExercisesMyController)
