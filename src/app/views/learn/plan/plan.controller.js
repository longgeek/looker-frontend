/**
 * Learn the plan controllers
 *
 * Functions (controllers)
 *  - PlanListController
 *  - PlanDetailController
 */


/**
 * PlanListController - List All Plans
 * used in Plan list view
 */
function PlanListController($scope, $auth, $timeout, RestFul) {
    $scope.planLoading = true;
    RestFul.response(
        {"action": "OnlineLearning:Plans", "params": {}},
        function(response) {
            if (!response) { return; }
            if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                $scope.plans = response.data.plans;
            }
            $timeout(function() { $scope.planLoading = false; }, 400)
        }
    )
    if ($auth.isAuthenticated()) {
        RestFul.global(
            {"action": "LearningProgress:JoinedPlans", "params": {}},
            function(response) {
                if (!response) { return; }
                if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                    $scope.joinedPlans = response.data;
                }
            }
        )
    }
}


/**
 * PlanDetailController - Detail Plan
 * used in Plan detail view
 */
function PlanDetailController($scope, $auth, $timeout, $stateParams, RestFul, $rootScope) {
    if (!$stateParams.ud) { return; }

    $scope.get_plan = function() {
        $scope.planDetailLoading = true;
        if ($auth.isAuthenticated()) {
            // Get the plan progress
            RestFul.response(
                {"action": "LearningProgress:PlanProgress", "params": {"plan": $stateParams.ud}},
                function(response) {
                    if (!response) { return; }
                    if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                        $scope.planProgress = response.data;
                    }
                }
            )
        }

        // Get the plan detail
        RestFul.error(
            {
                "action": "OnlineLearning:PlanDetail",
                "params": {"plan": $stateParams.ud}
            },
            function(response) {
                if (!response) { return; }
                if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                    $scope.plan = response.data;
                    $rootScope.pageData.title = response.data.name + $rootScope.defaultTitle;
                    $rootScope.pageData.description = response.data.description;
                    $scope.plan.cgroups = {};
                    $scope.plan.cgroups_index = [];

                    for (i in $scope.plan.subcourses_index) {
                        key = $scope.plan.subcourses_index[i];
                        value = $scope.plan.subcourses[key];
                        if ($scope.plan.cgroups_index.indexOf(value.cgroup_name) === -1) {
                            $scope.plan.cgroups_index.push(value.cgroup_name);
                            $scope.plan.cgroups[value.cgroup_name] = {"courses": [value]};
                        } else {
                            $scope.plan.cgroups[value.cgroup_name].courses.push(value);
                        }
                    }

                    for (j in $scope.plan.cgroups) {
                        period = 0;
                        expense = 0;
                        progress = 0;
                        for (k in $scope.plan.cgroups[j].courses) {
                            value = $scope.plan.cgroups[j].courses[k];
                            // preiod
                            if (value.estimated_lesson_period) { period += value.estimated_lesson_period; }
                            // expense
                            if (value.estimated_lesson_expense) { expense += value.estimated_lesson_expense; }
                            // progress
                            if ($auth.isAuthenticated() && $scope.planProgress && $scope.planProgress.joined_subcourses[value.subcourse_type + ":" + value.uuid]) {
                                progress += $scope.planProgress.joined_subcourses[value.subcourse_type + ":" + value.uuid].completed_percentage;
                            }
                        }
                        $scope.plan.cgroups[j].period = period;
                        $scope.plan.cgroups[j].expense = expense;
                        progress = progress / ($scope.plan.cgroups[j].courses.length);
                        $scope.plan.cgroups[j].progress = progress;
                    }
                    $timeout(function() { $scope.planDetailLoading = false; }, 300)
                } else if (response.hasOwnProperty('warning')) {
                    $timeout(function() { $scope.planDetailLoading = false; }, 300)
                }

            }
        )
    }
    $scope.get_plan();

    $scope.join_plan = function() {
        $scope.joinPlanLoading = true;
        RestFul.response(
            {"action": "OnlineLearning:JoinLearnSubmit", "params": {"origin": "plan", "uuid": $stateParams.ud}},
            function(response) {
                if (!response) { return; }
                if (response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                    $timeout(function() {
                        $scope.get_plan();
                        $scope.joinPlanLoading = false;
                    }, 500)
                } else {
                    $timeout(function() { $scope.joinPlanLoading = false; }, 500)
                }
            }
        )
    }
}

angular
    .module('appLooker')
    .controller('PlanListController', PlanListController)
    .controller('PlanDetailController', PlanDetailController)
