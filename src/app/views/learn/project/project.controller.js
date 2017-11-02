/**
 * Project of projects controllers
 *
 * Functions (controllers)
 *  - ProjectListController
 *  - ProjectDetailController
 */


/**
 * ProjectListController - List All Projects
 * used in project list view
 */
function ProjectListController($scope, $auth, $timeout, RestFul) {
    $scope.projectLoading = true;
    RestFul.response(
        {"action": "OnlineLearning:Projects", "params": {}},
        function(response) {
            if (!response) { return; }
            if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                $scope.projects = response.data.projects;
            }
            $timeout(function() { $scope.projectLoading = false; }, 400)
        }
    )
    if ($auth.isAuthenticated()) {
        RestFul.global(
            {"action": "LearningProgress:JoinedProjects", "params": {}},
            function(response) {
                if (!response) { return; }
                if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                    $scope.joinedProjects = response.data;
                }
            }
        )
    }
}


/**
 * ProjectDetailController - Detail Project
 * used in project detail view
 */
function ProjectDetailController($scope, $auth, $timeout, $stateParams, RestFul) {
    if (!$stateParams.ud) { return; }
    $scope.projectDetailLoading = true;

    // Get the project detail
    RestFul.error(
        {
            "action": "OnlineLearning:ProjectDetail",
            "params": {"project": $stateParams.ud}
        },
        function(response) {
            if (!response) { return; }
            if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                $scope.project = response.data;

                $scope.projectStageCount = 0;
                $scope.projectTaskCount = 0;
                for (stage in $scope.project.stages) {
                    $scope.projectStageCount += 1;
                    for (task in $scope.project.stages[stage].tasks) {
                        $scope.projectTaskCount += 1;
                    }
                }

                if ($auth.isAuthenticated()) {
                    // Get the Project learn progress
                    RestFul.error(
                        {
                            "action": "LearningProgress:ProjectProgress",
                            "params": {"project": $stateParams.ud}
                        },
                        function(response) {
                            if (response.data) {
                                $scope.projectProgress = response.data;
                            } else {
                                $scope.projectProgress = '';
                            }
                            $timeout(function() { $scope.projectDetailLoading = false; }, 300)
                        }
                    )
                } else { $timeout(function() { $scope.projectDetailLoading = false; }, 300)}
            } else { $timeout(function() { $scope.projectDetailLoading = false; }, 300)}
        }
    )
}

angular
    .module('appLooker')
    .controller('ProjectListController', ProjectListController)
    .controller('ProjectDetailController', ProjectDetailController)
