/**
 * Learn the Study Quit learn controllers
 *
 * Functions (controllers)
 *  - StudyQuitController
 */


/**
 * StudyQuitController - quit learn
 * used in study-quit view
 */
function StudyQuitController($scope, $state, $timeout, $uibModalInstance, $location, RestFul, $rootScope, autoQuit, ipCookie) {
    $scope.autoQuit = autoQuit;
    var backCourseInfo;
    function get_quit_status() {
        RestFul.global(
            {"action": "WorkspaceCenter:Status", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data.state === 'FREE') {
                        $scope.study_quit = true;
                        $timeout(function() {
                            $scope.studyQuitDone();
                        }, 4000)
                    } else if (response.data.state === 'QUITTING') {
                        $scope.study_quit = 'quiting';
                        status_code = response.data.progress.status_code;
                        backCourseInfo = {"origin": response.data.origin, "source": response.data.source};
                        if (status_code === 100) {
                            $timeout(function() {
                                get_quit_status();
                            }, 500)
                        } else if (status_code === 1 || status_code === -1) {
                            msgs = "退出学习过程中系统遇到异常, 当前计费已终止.";
                            $scope.QuitingError = {"status": "退出遇到异常", "msgs": msgs};
                        } else if (status_code >= 200) {
                            $timeout(function() {
                                get_quit_status();
                            }, 500)
                        }
                    }
                }
            },
            function(error) {
                if (error.status === -1) {
                    msgs = "网络异常, 无法连接到服务器.";
                    $scope.quitingError = {"status": "网络故障", "msgs": msgs};
                }
            }
        )
    }
    // Confirm exit learning
    $scope.studyQuitConfirm = function () {
        // Send a request to confirm the exit learning
        RestFul.error(
            {"action": "WorkspaceCenter:RequestFinish", "params": {}},
            function(response) {
                if (!response) { return; };
                // After the request is sent successfully, the exit status inquiry
                if (response.hasOwnProperty('message')) {
                    $scope.$parent.$broadcast('timer-stop');
                    $timeout(function() { $scope.study_quit = 'quiting'; }, 0)
                    get_quit_status();
                } else if (response.hasOwnProperty('warning')) {
                    if (response.inner_code === 101) {
                        $scope.studyQuitDone();
                    } else if (response.inner_code === 102) {
                        $scope.studyQuitDone();
                    } else if (response.inner_code === 103) {
                        $scope.$parent.$broadcast('timer-stop');
                        $timeout(function() {
                            $scope.study_quit = 'quiting';
                        }, 0)
                        $scope.studyQuitDone();
                    }
                }
            }
        )
    };
    if ($scope.autoQuit) { $scope.studyQuitConfirm(); };
    $scope.studyQuitDone = function () {
        $rootScope.remindLearn.status = false;
        if ($state.is('study')) {
            if (!backCourseInfo || !backCourseInfo.hasOwnProperty('origin') || !backCourseInfo.hasOwnProperty('source')) {
                url = "/learn/course";
            } else {
                if (backCourseInfo.origin === 'plan') {
                    url = "/learn/plan/detail/?ud=" + backCourseInfo.source.plan;
                } else if (backCourseInfo.origin === 'course') {
                    url = "/learn/course/detail/?ud=" + backCourseInfo.source.course;
                } else if (backCourseInfo.origin === 'project') {
                    url = "/learn/project/detail/?ud=" + backCourseInfo.source.project;
                } else if (backCourseInfo.origin === 'lab') {
                    url = "/learn/lab/detail/?ud=" + backCourseInfo.source.lab;
                } else if (backCourseInfo.origin === 'quiz') {
                    url = "/learn/quiz/detail/?ud=" + backCourseInfo.source.quiz;
                } else if (backCourseInfo.origin === 'exercise') {
                    url = "/exercises";
                }
            }
            $timeout(function() {
                if ($rootScope.socket && $rootScope.socket.connected) {
                    $rootScope.socket.close();
                    $rootScope.socket = null;
                }
                $location.url(url);
            }, 300)
            $uibModalInstance.dismiss('cancel');
        } else {
            $timeout(function() {
                $uibModalInstance.dismiss('cancel');
            }, 300)
        }
        ipCookie.remove('idle');
    }
    $scope.studyQuitCancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}


angular
    .module('appLooker')
    .controller('StudyQuitController', StudyQuitController)
