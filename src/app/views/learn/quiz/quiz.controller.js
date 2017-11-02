/**
 * Quiz of quizs controllers
 *
 * Functions (controllers)
 *  - QuizListController
 *  - QuizDetailController
 */


/**
 * QuizListController - List All Quizs
 * used in quiz list view
 */
function QuizListController($scope, RestFul) {
    $scope.quiz_list = function() {
        RestFul.error(
            {"action": "OnlineLearning:Quizzes", "params": {}},
            function(response) {
                if (response.hasOwnProperty('message')) {
                    $scope.quizs = response.data.quizzes;
                }
            }
        )
    }
}


/**
 * QuizDetailController - Detail Quiz
 * used in quiz detail view
 */
function QuizDetailController($scope, $auth, $stateParams, RestFul) {
    $scope.stateParams = angular.copy($stateParams);

    // Get the quiz detail
    RestFul.error(
        {
            "action": "OnlineLearning:QuizDetail",
            "params": {"quiz": $scope.stateParams.ud}
        },
        function(response) {
            if (response) {
                $scope.quiz = response.data;
                if ($auth.isAuthenticated()) {
                    // Get the Quiz learn progress
                    RestFul.error(
                        {
                            "action": "LearningProgress:QuizProgress",
                            "params": {"quiz": $scope.stateParams.ud}
                        },
                        function(response) {
                            if (response.data) {
                                $scope.quizProgress = response.data;
                            } else {
                                $scope.quizProgress = '';
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
    .controller('QuizListController', QuizListController)
    .controller('QuizDetailController', QuizDetailController)
