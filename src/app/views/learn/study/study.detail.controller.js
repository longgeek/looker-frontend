/**
 * Learn the Study Detail controllers
 *
 * Functions (controllers)
 *  - StudyDetailController
 *  - StudyDetailContentController
 */


/**
 * StudyDetailController - Detail Plan or Course
 * used in study-detail-(plan|course) view
 */
function StudyDetailController($scope, $uibModal, RestFul) {
    $scope.studyDetail = function() {
        // 当前课程为 Plan
        // 需要遍历 Plan 里所有课程的详细内容
        var windowClass = 'animated fadeIn study-detail__modal';
        if ($scope.taskSession.origin === 'plan') {
            $scope.currentDetailCourse = angular.copy($scope.course);
            $scope.currentDetailCourse.subcourse_type = 'course';
            $scope.currentDetailPart = angular.copy($scope.part);
            studyDetailTmp = 'app/views/learn/study/study-detail-plan.html';
        } else if ($scope.taskSession.origin === 'course') {
            $scope.currentDetailCourse = angular.copy($scope.course);
            $scope.currentDetailPart = angular.copy($scope.part);
            studyDetailTmp = 'app/views/learn/study/study-detail-course.html';
        } else if ($scope.taskSession.origin === 'project') {
            windowClass = 'animated fadeIn study-detail__modal subcourse-detail-modal';
            studyDetailTmp = 'app/views/learn/study/study-detail-project.html';
        } else if ($scope.taskSession.origin === 'lab') {
            windowClass = 'animated fadeIn study-detail__modal subcourse-detail-modal';
            studyDetailTmp = 'app/views/learn/study/study-detail-lab.html';
        } else if ($scope.taskSession.origin === 'quiz') {
            windowClass = 'animated fadeIn study-detail__modal subcourse-detail-modal';
            studyDetailTmp = 'app/views/learn/study/study-detail-quiz.html';
        } else if ($scope.taskSession.origin === 'exercise') {
            windowClass = 'animated fadeIn study-detail__modal subcourse-detail-modal';
            studyDetailTmp = 'app/views/learn/study/study-detail-exercise.html';
        }

        var uibModalInstance = $uibModal.open({
            templateUrl: studyDetailTmp,
            scope: $scope,
            backdrop: 'false',
            keyboard: true,
            size: 'md',
            windowClass: windowClass,
            backdropClass: 'study-detail__backdrop',
            controller: StudyDetailContentController,
        });
    }
}


/**
 * StudyDetailContentController - Detail Plan or Course
 */
function StudyDetailContentController($scope, $timeout, RestFul) {
    $scope.courseDetail = function(event, uuid, type) {
        if (!event.currentTarget.parentNode.className.includes('active')) {
            if (uuid === $scope.taskSession.source.current_course_uuid) {
                $scope.currentDetailPart = false;
                $timeout(function() {
                    $scope.currentDetailCourse = angular.copy($scope.course);
                    $scope.currentDetailCourse.subcourse_type = type;
                    $scope.currentDetailPart = angular.copy($scope.part);
                }, 0);
            } else {
                RestFul.global(
                    {
                        "action": "OnlineLearning:PlanSubDetail",
                        "params": {
                            "plan": $scope.taskSession.source.current_plan_uuid,
                            "subcourse_type": type,
                            "subcourse_uuid": uuid,
                        }
                    },
                    function(response) {
                        if (!response) { return; };
                        if (response.hasOwnProperty('message')) {
                            $scope.currentDetailCourse = response.data;
                            $scope.currentDetailCourse.subcourse_type = type;
                            $scope.currentDetailPart = false;
                        }
                    }
                )
            }
        } else {
            $scope.currentDetailPart = false;
        }
    }

    $scope.partDetail = function(uuid) {
        if (uuid !== $scope.currentDetailPart.uuid) {
            $scope.currentDetailPart = false;
            part_index = $scope.currentDetailCourse.parts_index.indexOf(uuid);
            $timeout(function() {
                $scope.currentDetailPart = $scope.currentDetailCourse.parts[part_index];
            }, 0);
        }
    }
}


angular
    .module('appLooker')
    .controller('StudyDetailController', StudyDetailController)
    .controller('StudyDetailContentController', StudyDetailContentController)
