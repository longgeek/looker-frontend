/**
 * Course of courses controllers
 *
 * Functions (controllers)
 *  - CourseListController
 *  - CourseDetailController
 */


/**
 * CourseListController - List All Courses
 * used in course list view
 */
function CourseListController($scope, $auth, $timeout, RestFul) {
    $scope.courseLoading = true;
    RestFul.global(
        {"action": "OnlineLearning:Courses", "params": {}},
        function(response) {
            if (!response) { return; }
            if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                $scope.courses = response.data.courses;
            }
            $timeout(function() { $scope.courseLoading = false; }, 400)
        }
    )
    if ($auth.isAuthenticated()) {
        RestFul.global(
            {"action": "LearningProgress:JoinedCourses", "params": {}},
            function(response) {
                if (!response) { return; }
                if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                    $scope.joinedCourses = response.data;
                }
            }
        )
    }
}


/**
 * CourseDetailController - Detail Course
 * used in course detail view
 */
function CourseDetailController($scope, $auth, $timeout, $stateParams, RestFul, $rootScope) {
    if (!$stateParams.ud) { return; }
    $scope.courseDetailLoading = true;

    // Get the course detail
    RestFul.error(
        {
            "action": "OnlineLearning:CourseDetail",
            "params": {"course": $stateParams.ud}
        },
        function(response) {
            if (!response) { return; }
            if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                $scope.course = response.data;
                $rootScope.pageData.title = response.data.name + $rootScope.defaultTitle;
                $rootScope.pageData.description = response.data.description;

                $scope.courseStageCount = 0;
                $scope.courseTaskCount = 0;
                for (part in $scope.course.parts) {
                    for (stage in $scope.course.parts[part].stages) {
                        $scope.courseStageCount += 1;
                        for (task in $scope.course.parts[part].stages[stage].tasks) {
                            $scope.courseTaskCount += 1;
                        }
                    }
                }

                if ($auth.isAuthenticated()) {
                    // Get the Course learn progress
                    RestFul.error(
                        {
                            "action": "LearningProgress:CourseProgress",
                            "params": {"course": $stateParams.ud}
                        },
                        function(response) {
                            if (!response) { return; }
                            if (response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                                $scope.courseProgress = response.data;
                            }
                            $timeout(function() { $scope.courseDetailLoading = false; }, 300)
                        }
                    )
                } else {
                    $timeout(function() { $scope.courseDetailLoading = false; }, 300)
                }
            } else {
                $timeout(function() { $scope.courseDetailLoading = false; }, 300)
            }
        }
    )
}

angular
    .module('appLooker')
    .controller('CourseListController', CourseListController)
    .controller('CourseDetailController', CourseDetailController)
