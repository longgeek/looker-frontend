/**
 * Lab of exercises controllers
 *
 * Functions (controllers)
 *  - ExercisesController
 */


/**
 * ExercisesController - List All Exercises
 * used in exercises/exercises.html view
 */
function ExercisesController($scope, RestFul) {
    $scope.exercises_list = function() {
        $scope.classifys = {
            "a": {
                "name": "BY SUBJECT",
                "sorted": [1, 2, 3, 4, 5],
                "values": {
                    "1": {"name": "Web Development"},
                    "2": {"name": "Programming"},
                    "3": {"name": "Data Science"},
                    "4": {"name": "Partnerships"},
                    "5": {"name": "Design"},
                }
            },
            "b": {
                "name": "BY LANGUAGE",
                "sorted": [1, 2, 3, 4, 5, 6, 7],
                "values": {
                    "1": {"name": "HTML & CSS"},
                    "2": {"name": "Python"},
                    "3": {"name": "Javascript"},
                    "4": {"name": "Java"},
                    "5": {"name": "SQL"},
                    "6": {"name": "Bash/Shell"},
                    "7": {"name": "Ruby"},
                }
            },
        };
        RestFul.error(
            {"action": "OnlineLearning:ExerciseList", "params": {}},
            function(response) {
                if (response.hasOwnProperty('message')) {
                    $scope.exercises = response.data;
                }
            }
        )
    }

    $scope.exercises_list();
}
angular
    .module('appLooker')
    .controller('ExercisesController', ExercisesController)
