/**
 * Learn the Study controllers
 *
 * Functions (controllers)
 *  - StudyController
 *  - StudyStatusController
 */


/**
 * StudyController - Study
 * used in study.html view
 */
function StudyController($rootScope, $scope, $q, $sce, $state, $auth, $uibModal, $location, GLOBAL_VAR, RestFul, $timeout, $uibModalStack, LearnPosition, ipCookie, $window, $interval, toaster) {
    // Api loading make layer
    $scope.studyLayerFunc = function(bool) {
        if (!bool) {
            $timeout(function() { $scope.studyLayer = bool; }, 500)
        } else {
            $timeout(function() { $scope.studyLayer = bool; }, 0)
        }
    }
    // Go to th study page
    $scope.studyReload = function(position) {
        LearnPosition.learn_position = position;
        $window.location.reload();
        ipCookie('learnPosition', position, {'path': '/'});
    }

    // Check the (plan course part stage task) the uuid params.
    // Check for service and cookies
    if (LearnPosition.learn_position) {
        position = LearnPosition.learn_position;
    } else if (ipCookie('learnPosition')) {
        position = ipCookie('learnPosition');
        LearnPosition.learn_position = position;
    } else {
        $location.url('/learn/course');
        return;
    }

    // // Wait time start
    // var startTime = new Date();

    // progress bar random value
    function random(a, b) { return a + Math.random() * (b - a); }

    $scope.BootingProgress = 0;

    // progress bar function
    function boot_check(status) {
        $timeout(function() {
            if (!$auth.isAuthenticated()) {
                $scope.BootingSteps = [];
                msgs = "登录会话过期，请登录后学习。";
                $scope.BootingError = {"status": true, "msgs": msgs, "goto": "login"};
                if ($rootScope.socket && $rootScope.socket.connected) {
                    $rootScope.socket.close();
                    $rootScope.socket = null;
                }
                return;
            }
        }, 160)
        if (!status) {
            if ($scope.BootingError && $scope.BootingError.goto !== "last") {
                if ($rootScope.socket) { $rootScope.socket.close(); }
                $rootScope.socket = null;
            }
            return;
        } else if (status === 100) {
            LoadStudyPage();
            $scope.BootingProgress = 100;
            $timeout(function() { $scope.BootingStatus = true; }, 500);
        }
        // // Api determine whether the request is more than 10 seconds
        // var nowTime = new Date();
        // var execTime = (nowTime.getTime() - startTime.getTime()) / 1000;
        // if (execTime >= 3) {
        //     $scope.BootingError = true;
        //     $scope.BootingError = {
        //         "status": true,
        //         "goto": "timeout",
        //         "msgs": "进入学习超时，请检查你的网络环境."
        //     };
        //     return;
        // }

        // Increase the progress bar
        if ($scope.BootingProgress >= random(70, 80) && $scope.BootingProgress <= 90) {
            $scope.BootingProgress += 2;
        } else if ($scope.BootingProgress <= 70) {
            $scope.BootingProgress += random(5, 10);
        } else if ($scope.BootingProgress > 90 && $scope.BootingProgress <= 100) {
            $scope.BootingProgress += 0.5;
        }
        $timeout(function() {
            if (!$scope.BootingError) {
                boot_check(true);
            }
        }, 300);
    }
    boot_check(true);

    $scope.quitting = false;

    $scope.showBootingSteps = function() {
        $scope.BootingStepsDetail = !$scope.BootingStepsDetail;
    }
    $scope.studyBootingBack = function() {
        if (position.origin === "exercise") {
            $location.url("/exercises");
            return;
        }
        url = "/learn/" + position.origin + "/detail/?ud=" + position.source[position.origin];
        $location.url(url);
    }

    // While to check booting status.
    // Return status: FREE | RUNNING | BOOTING | QUITING
    $scope.BootingSteps = [];
    function get_boot_status() {
        RestFul.response(
            {"action": "WorkspaceCenter:Status", "params": {}},
            function(response) {
                if (!response) {
                    boot_check(false);
                    msgs = "控制台在初始化出现异常，请尝试刷新页面。";
                    $scope.BootingError = {"status": true, "msgs": msgs, "goto": "timeout"};
                    return;
                };
                if (!$rootScope.socket || !$rootScope.socket.connected) {
                    console.log($rootScope.socket);
                    boot_check(false);
                    $scope.BootingSteps = [];
                    msgs = "登录会话丢失，请尝试刷新页面或重新登录。";
                    $scope.BootingError = {"status": true, "msgs": msgs, "goto": "timeout"};
                    return;
                };
                if (response.hasOwnProperty("message")) {
                    // Workspace is running, Load study page.
                    if (response.data.state === 'RUNNING') {
                        if ($scope.BootingSteps.indexOf("RUNNING") === -1) {
                            $scope.BootingSteps.push('RUNNING');
                        }
                        if (!courseConsistencyCheck(response.data)) {
                            boot_check(false);
                            msgs = "你有正在学习的课程, 暂不能进入当前课。";
                            $scope.BootingError = {"status": true, "msgs": msgs, "goto": "last", "data": response.data};
                            return;
                        }
                        boot_check(100);
                    }
                    // Workspace is booting, Continue check state
                    else if (response.data.state === 'BOOTING') {
                        for (i in response.data.progress.history) {
                            if ($scope.BootingSteps.indexOf(response.data.progress.history[i].message) === -1) {
                                $scope.BootingSteps.push(response.data.progress.history[i].message);
                            }
                        }
                        if (!courseConsistencyCheck(response.data)) {
                            boot_check(false);
                            msgs = "你有正在学习的课程, 暂不能进入当前课。";
                            $scope.BootingError = {"status": true, "msgs": msgs, "goto": "last", "data": response.data};
                            return;
                        }
                        status_code = response.data.progress.status_code;
                        if (status_code === 100) {
                            if ($scope.quitting) {
                                $scope.BootingProgress = 0;
                                $scope.quitting = false;
                            }
                            $timeout(function() {
                                get_boot_status();
                            }, 500)
                        } else if (status_code === 101) {
                            boot_check(false);
                            msgs = "当前账户余额不足，请在充值后进入学习.";
                            $scope.BootingError = {"status": true, "msgs": msgs, "goto": "recharge"};
                        } else if (status_code === 1 || status_code === -1) {
                            boot_check(false);
                            msgs = "系统内部出现异常, 请报告问题给我们.";
                            $rootScope.dialogTicketData = response;
                            $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ticket", "data": response.data};
                        } else if (status_code >= 200) {
                            $timeout(function() {
                                get_boot_status();
                            }, 500)
                        }
                    }
                    else if (response.data.state === 'QUITTING') {
                        for (i in response.data.progress.history) {
                            if ($scope.BootingSteps.indexOf(response.data.progress.history[i].message) === -1) {
                                $scope.BootingSteps.push(response.data.progress.history[i].message);
                            }
                        }
                        $scope.quitting = true;
                        status_code = response.data.progress.status_code;
                        if (status_code === 100) {
                            $timeout(function() {
                                get_boot_status();
                            }, 500)
                        } else if (status_code === 1 || status_code === -1) {
                            boot_check(false);
                            msgs = "系统内部出现异常, 请报告问题给我们.";
                            $rootScope.dialogTicketData = response;
                            $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ticket", "data": response.data};
                        } else if (status_code >= 200) {
                            $timeout(function() {
                                get_boot_status();
                            }, 500)
                        }
                    }
                } else  {
                    boot_check(false);
                    msgs = "系统内部出现异常, 请报告问题给我们.";
                    $rootScope.dialogTicketData = response;
                    $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ticket", "data": response.data};
                }
            },
            function(error) {
                if (error.status === -1) {
                    boot_check(false);
                    msgs = "网络异常, 无法连接到服务器.";
                    $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ERR_CONNECTION_REFUSED"};
                } else {
                    boot_check(false);
                    msgs = "服务器异常, 请刷新页面尝试.";
                    $scope.BootingError = {"status": true, "msgs": msgs, "goto": "timeout"};
                }
            }
        )
    }

    if ($rootScope.socket && $rootScope.socket.hasOwnProperty('connected') && $rootScope.socket.connected) {
        $scope.BootingSteps.push('Socket Connected!');
        // First get the study status, if free to request booting.
        RestFul.response(
            {"action": "WorkspaceCenter:Status", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    // Workspace is free, Send boot workspace request.
                    if (response.data.state === 'FREE') {
                        start_workspace();
                        if ($scope.BootingSteps.indexOf("FREE") === -1) {
                            $scope.BootingSteps.push('FREE');
                        }
                    } else {
                        get_boot_status();
                    }
                }
            },
            function(error) {
                if (error.status === -1) {
                    boot_check(false);
                    msgs = "网络异常, 无法连接到服务器.";
                    $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ERR_CONNECTION_REFUSED"};
                } else {
                    boot_check(false);
                    msgs = "服务器异常, 请刷新页面尝试.";
                    $scope.BootingError = {"status": true, "msgs": msgs, "goto": "timeout"};
                }
            }
        )
    } else {
        try {
            socket_url = $scope.user.socket_url + "?socket_form=/workspace/&session_key=" + $scope.user.session_key + "&user_uuid=" + $scope.user.user.uuid + "&username=" + $scope.user.username;
        } catch(e) {
            boot_check(false);
            msgs = "用户会话丢失，请尝试刷新页面或重新登录。";
            $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ERR_CONNECTION_REFUSED"};
            return;
        }
        $rootScope.socket = io(socket_url);
        $rootScope.socket.on('connect', function() {
            if ($scope.BootingProgress < 100) {
                $scope.BootingSteps.push('Socket Connected!');
                // First get the study status, if free to request booting.
                RestFul.response(
                    {"action": "WorkspaceCenter:Status", "params": {}},
                    function(response) {
                        if (!response) { return; };
                        if (response.hasOwnProperty('message')) {
                            // Workspace is free, Send boot workspace request.
                            if (response.data.state === 'FREE') {
                                start_workspace();
                                if ($scope.BootingSteps.indexOf("FREE") === -1) {
                                    $scope.BootingSteps.push('FREE');
                                }
                            } else {
                                get_boot_status();
                            }
                        }
                    },
                    function(error) {
                        if (error.status === -1) {
                            boot_check(false);
                            msgs = "网络异常, 无法连接到服务器.";
                            $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ERR_CONNECTION_REFUSED"};
                        } else {
                            boot_check(false);
                            msgs = "服务器异常, 请刷新页面尝试.";
                            $scope.BootingError = {"status": true, "msgs": msgs, "goto": "timeout"};
                        }
                    }
                )
            } else {
                $scope.socketLayer = false;
                angular.element('.study-timer')[0].start();
            }
        })
        $rootScope.socket.on('disconnect', function() {
            if ($state.is('study')) {
                if ($scope.BootingProgress >= 100) {
                    $scope.socketLayer = true;
                    angular.element('.study-timer')[0].stop();
                    $scope.closeModal();
                } else {
                    boot_check(false);
                    msgs = "网络异常, 无法连接到服务器.";
                    $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ERR_CONNECTION_REFUSED"};
                }
            }
        })
        reconnect_number = 0;
        $rootScope.socket.on('connect_error', function() {
            reconnect_number += 1;
            if (reconnect_number > 1) {
                boot_check(false);
                msgs = "网络异常, 无法和服务器建立会话.";
                $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ERR_CONNECTION_REFUSED"};
                $rootScope.socket.close();
                $rootScope.socket = null;
                return;
            }
        })
        $rootScope.socket.on('invalidate', function(e) {
            $rooScope.socket.close();
            $rootScope.socket = null;
            msgs = "网络异常, 无法和服务器建立会话.";
            $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ERR_CONNECTION_REFUSED"};
            $rootScope.dialogTicketData = e;
            toaster.pop({
                type: 'error',
                title: msgs,
                timeout: 5000,
                body: "app/views/toaster/toaster-error.html",
                bodyOutputType: 'template',
                showCloseButton: true,
            });
        })

        $rootScope.socket.on('message', function(e) {
            if (e === 'workspace_inactivity_and_timeout') {
                var openedModal = $uibModalStack.getTop();
                if (!openedModal || openedModal.value.modalDomEl.attr('class').indexOf('idle-quit') === -1) {
                    if ($rootScope.remindLearn.status && $rootScope.socket && $rootScope.socket.connected) {
                        if ($state.is('study')) {
                            // Open idle time modal
                            if (openedModal) {
                                windowClass = 'idle-quit idle-quit-dark';
                            } else {
                                windowClass = 'idle-quit';
                            }
                            var uibModalInstance = $uibModal.open({
                                templateUrl: 'app/views/learn/study/study-idle-quit.html',
                                backdrop: 'static',
                                keyboard: false,
                                windowClass: windowClass,
                                controller: StudyIdleQuitController,
                            });
                        } else {
                            $rootScope.remindLearn.quit = true;
                        }
                    }
                }
            } else if (e === 'workspace_inactivity_and_exit') {
                if ($state.is('study')) {
                    var openedModal = $uibModalStack.getTop();
                    if (openedModal && openedModal.value.modalDomEl.attr('class').indexOf('idle-quit') !== -1) {
                        $uibModalStack.dismiss(openedModal.key);
                        if ($rootScope.remindLearn.status && $rootScope.socket && $rootScope.socket.connected) {
                            $scope.closeModal();
                            $timeout(function() {
                                if ($state.is('study')) {
                                    position = ipCookie('learnPosition');
                                    if (position) {
                                        $state.go('learn.' + position.origin + '.detail', {'ud': position.source[position.origin]});
                                    } else {
                                        $location.url('/learn');
                                    }
                                };
                                $rootScope.remindLearn.status = false;
                                if ($rootScope.socket && $rootScope.socket.connected) {
                                    $rootScope.socket.close();
                                    $rootScope.socket = null;
                                }
                                // $scope.studyQuit(true);
                            }, 300)
                        }
                    }
                } else {
                    if ($rootScope.remindLearn.status && $rootScope.socket && $rootScope.socket.connected) {
                        $rootScope.remindLearn.quit = false;
                        $timeout(function() {
                            $rootScope.remindLearn.status = false;
                            if ($rootScope.socket && $rootScope.socket.connected) {
                                $rootScope.socket.close();
                                $rootScope.socket = null;
                            }
                        }, 300)
                    }
                }
                ipCookie.remove('idle');
            }
        })
    }
    // Booting status is free, to start workspace.
    function start_workspace() {
        RestFul.error(
            {
                "action": "WorkspaceCenter:RequestBooting",
                "params": position,
            },
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')){
                    get_boot_status();
                } else if (response.hasOwnProperty('warning')) {
                    if (response.inner_code === 101 && response.inner_code === 102) {
                        get_boot_status();
                    } else if (response.inner_code === 103) {
                        boot_check(false);
                        msgs = "你有学习控制台正在退出，请等待退出后重新进入。";
                        $scope.BootingError = {"status": true, "msgs": msgs, "goto": "timeout"};
                    } else if (response.inner_code === 104) {
                        boot_check(false);
                        msgs = "你在其它浏览器或电脑上，有正在开启的学习，请退出后再次尝试。";
                        $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ERR_CONNECTION_REFUSED"};
                    } else {
                        boot_check(false);
                        msgs = response.warning;
                        $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ERR_CONNECTION_REFUSED"};
                    }
                } else if (response.hasOwnProperty('error')) {
                    boot_check(false);
                    msgs = "服务器异常, 请刷新页面尝试.";
                    $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ERR_CONNECTION_REFUSED"};
                }
            },
            function(error) {
                if (error.status === -1) {
                    boot_check(false);
                    msgs = "网络异常, 无法连接到服务器.";
                    $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ERR_CONNECTION_REFUSED"};
                } else {
                    boot_check(false);
                    msgs = "服务器异常, 请刷新页面尝试.";
                    $scope.BootingError = {"status": true, "msgs": msgs, "goto": "ERR_CONNECTION_REFUSED"};
                }
            }
        )
    }

    // To determine whether the course of workspace is consistent with the current
    function courseConsistencyCheck(workspace_course) {
        if (workspace_course.origin === position.origin) {
            if (workspace_course.origin === "course" && workspace_course.source.course === position.source.course) {
                return true;
            } else if (workspace_course.origin === "plan" && workspace_course.source.plan === position.source.plan) {
                if (workspace_course.source.course === position.source.course) {
                    return true;
                } else {
                    return false;
                }
            } else if (workspace_course.origin === "project" && workspace_course.source.project === position.source.project) {
                return true;
            } else if (workspace_course.origin === "lab" && workspace_course.source.lab === position.source.lab) {
                return true;
            } else if (workspace_course.origin === "quiz" && workspace_course.source.quiz === position.source.quiz) {
                return true;
            } else if (workspace_course.origin === "exercise" && workspace_course.source.exercise === position.source.exercise) {
                return true;
            }
            // diff_course = [];
            // for (i in position.source) {
            //     if (!workspace_course.source[i] || workspace_course.source[i] !== position.source[i]) {
            //         diff_course.push(i);
            //     }
            // }
            // if (diff_course.length === 0) {
            //     return true;
            // } else {
            //     return false;
            // }
        }
        return false;
    }


    // Everything ok, enter the learning page.
    function LoadStudyPage() {
        $rootScope.remindLearn.status = true;
        $scope.studyLayerFunc(true);
        // Start Time
        RestFul.global(
            {"action": "WorkspaceCenter:CurrentStudyTiming", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $scope.studyLearnTime = response.data;
                    // console.log('CurrentStudyTiming: ', response.data);
                    $scope.studyLearnTime.start_time = $scope.studyLearnTime.start_time * 1000 - new Date().getTimezoneOffset() * 60 * 1000;
                    // console.log('start_time: ', $scope.studyLearnTime.start_time);
                    // console.log('now time: ', new Date());
                    if ($scope.studyLearnTime.start_time > Date.parse(new Date())) {
                        $scope.studyLearnTime.start_time = Date.parse(new Date());
                        // console.log('start_time: ', $scope.studyLearnTime.start_time);
                    }
                }
            }
        )
        $scope.studyTime = function() {
            if (!$scope.socketLayer) {
                new_time = Date.parse(new Date());
                $scope.studyLearnTime.timing = Math.floor((new_time - $scope.studyLearnTime.start_time) / 1000);
                $interval(function() {
                    if (!$scope.socketLayer) {
                        new_time = Date.parse(new Date());
                        $scope.studyLearnTime.timing = Math.floor((new_time - $scope.studyLearnTime.start_time) / 1000);
                    }
                }, 1000)
            }
        }

        // Step 1. Load current task docs and check list.
        RestFul.global(
            {"action": "WorkspaceCenter:LoadTask", "params": position},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $scope.task = response.data;
                    $scope.taskSession = response.data.position;
                    if ($scope.task.check_lists && $scope.task.check_lists.length !== 0) {
                        getCheckListStatus();
                    }
                    if (GLOBAL_VAR.fullScreenTopic.indexOf($scope.task.tringtype) === -1) {
                        $timeout(function() {
                            $scope.isFullScreen = true;
                        }, 0)
                    } else {
                        $timeout(function() {
                            $scope.isFullScreen = false;
                            // $timeout(function() {
                            //     $scope.toStudyDocs();
                            // }, 1000);
                        }, 0);
                    }
                    $timeout(function() {
                        $scope.taskTemplate = 'app/views/learn/study/trings/' + $scope.task.tringtype + '.html';
                    }, 10)

                    if ($scope.taskSession.origin === 'plan') {
                        // Get plan detail
                        RestFul.global(
                            {
                                "action": "OnlineLearning:PlanDetail",
                                "params": {"plan": $scope.taskSession.source.current_plan_uuid}
                            },
                            function(response) {
                                if (!response) { return; };
                                if (response.hasOwnProperty('message')) {
                                    $scope.plan = response.data;
                                }
                            }
                        )
                        // Get Plan sub course detail
                        RestFul.global(
                            {
                                "action": "OnlineLearning:PlanSubDetail",
                                "params": {
                                    "plan": $scope.taskSession.source.current_plan_uuid,
                                    "subcourse_type": $scope.taskSession.source.current_subcourse_type,
                                    "subcourse_uuid": $scope.taskSession.source.current_course_uuid,
                                }
                            },
                            function(response) {
                                if (!response) { return; };
                                if (response.hasOwnProperty('message')) {
                                    $scope.course = response.data;
                                    part_index = $scope.course.parts_index.indexOf($scope.taskSession.source.current_part_uuid);
                                    $scope.part = $scope.course.parts[part_index];
                                    stage_index = $scope.part.stages_index.indexOf($scope.taskSession.source.current_stage_uuid);
                                    $scope.stage = $scope.part.stages[stage_index];
                                    $timeout(function() {
                                        $scope.tasks = $scope.stage.tasks;
                                    }, 0);
                                    course_index = $scope.plan.subcourses_index.indexOf($scope.course.uuid);
                                    $scope.plan.subcourses[course_index] = angular.copy($scope.course);
                                }
                            }
                        )
                    } else if ($scope.taskSession.origin === 'course') {
                        // Get Course detail
                        RestFul.global(
                            {
                                "action": "OnlineLearning:CourseDetail",
                                "params": {
                                    "course": $scope.taskSession.source.current_course_uuid,
                                }
                            },
                            function(response) {
                                if (!response) { return; };
                                if (response.hasOwnProperty('message')) {
                                    $scope.course = response.data;
                                    part_index = $scope.course.parts_index.indexOf($scope.taskSession.source.current_part_uuid);
                                    $scope.part = $scope.course.parts[part_index];
                                    stage_index = $scope.part.stages_index.indexOf($scope.taskSession.source.current_stage_uuid);
                                    $scope.stage = $scope.part.stages[stage_index];
                                    $timeout(function() {
                                        $scope.tasks = $scope.stage.tasks;
                                    }, 0);
                                }
                            }
                        )
                    } else if ($scope.taskSession.origin === 'project') {
                        projectDetailApi = {
                            "action": "OnlineLearning:ProjectDetail",
                            "params": {"project": $scope.taskSession.source.current_project_uuid}
                        }
                        // Get Project Detail
                        RestFul.global(
                            projectDetailApi,
                            function(response) {
                                if (!response) { return; };
                                if (response.hasOwnProperty('message')) {
                                    $scope.project = response.data;
                                    stage_index = $scope.project.stages_index.indexOf($scope.taskSession.source.current_stage_uuid);
                                    $scope.stage = $scope.project.stages[stage_index];
                                    $timeout(function() {
                                        $scope.tasks = $scope.stage.tasks;
                                    }, 0);
                                }
                            }
                        )
                    } else if ($scope.taskSession.origin === 'lab') {
                        // Get Lab Detail
                        labDetailApi = {
                            "action": "OnlineLearning:LabDetail",
                            "params": {"lab": $scope.taskSession.source.current_lab_uuid}
                        }
                        RestFul.global(
                            labDetailApi,
                            function(response) {
                                if (response) {
                                    $scope.lab = response.data;
                                    $scope.stage = response.data;
                                    $timeout(function() {
                                        $scope.tasks = response.data.tasks;
                                    }, 0);
                                }
                            }
                        )
                    } else if ($scope.taskSession.origin === 'quiz') {
                        // Get Quiz Detail
                        quizDetailApi = {
                            "action": "OnlineLearning:QuizDetail",
                            "params": {"quiz": $scope.taskSession.source.current_quiz_uuid}
                        }
                        RestFul.global(
                            quizDetailApi,
                            function(response) {
                                if (response) {
                                    $scope.quiz = response.data;
                                    $scope.stage = response.data;
                                    $timeout(function() {
                                        $scope.tasks = response.data.tasks;
                                    }, 0);
                                }
                            }
                        )
                    } else if ($scope.taskSession.origin === 'exercise') {
                        // Get Exercise Detail
                        exerciseDetailApi = {
                            "action": "OnlineLearning:ExerciseDetail",
                            "params": {"exercise": $scope.taskSession.source.current_exercise_uuid}
                        }
                        RestFul.global(
                            exerciseDetailApi,
                            function(response) {
                                if (response) {
                                    $scope.exercise = response.data;
                                    $scope.stage = response.data;
                                    $timeout(function() {
                                        $scope.tasks = response.data.tasks;
                                    }, 0);
                                }
                            }
                        )
                    }
                }
                $scope.studyLayerFunc(false);

                // Step 3. Get current tasks progress.
                currentProgressApi = {
                    "action": "WorkspaceCenter:LoadLearningProgress",
                    "params": {
                        "origin": $scope.taskSession.origin,
                        "uuid": $scope.taskSession.source['current_' + $scope.taskSession.origin + '_uuid'],
                    },
                };
                RestFul.global(
                    currentProgressApi,
                    function(response) {
                        if (!response) { return; };
                        if (response.hasOwnProperty('message')) {
                            $scope.currentStudyProgress = response.data;
                            $scope.completed_tasks = [];
                            if ($scope.taskSession.origin === 'plan' || $scope.taskSession.origin === 'course' || $scope.taskSession.origin === 'project') {
                                if (response.data.progress.stages_achievement[$scope.taskSession.source.current_stage_uuid]) {
                                    $scope.completed_tasks = response.data.progress.stages_achievement[$scope.taskSession.source.current_stage_uuid].completed_tasks_uuid;
                                    $scope.stageProgress = response.data.progress.stages_achievement[$scope.taskSession.source.current_stage_uuid].completed_percentage;
                                } else {
                                    $scope.stageProgress = 0;
                                }
                            } else {
                                $scope.stageProgress = $scope.currentStudyProgress.completed_percentage;
                                // for (i in $scope.currentStudyProgress.progress.tasks_achievement) {
                                //     if ($scope.currentStudyProgress.progress.tasks_achievement[i].is_completed) {
                                //         $scope.completed_tasks.push(i);
                                //     }
                                // }
                            }
                        }
                    }
                )
            }
        )

        function getCheckListStatus () {
            $scope.completeCheckList = ipCookie("completeCheckList");
            // 当前 task 还没有完成的 check list
            $scope.currentCheckList = {};
            if (!$scope.completeCheckList) {
                $scope.currentCheckList.uuid = $scope.task.check_lists[0].uuid;
                $scope.currentCheckList.index = 0;
            } else {
                for (i=0; i<$scope.task.check_lists.length; i++) {
                    if ($scope.task.check_lists[i].uuid === $scope.completeCheckList) {
                        // 判断是不是最后一个 check list
                        if (i !== $scope.task.check_lists.length - 1) {
                            $scope.currentCheckList.uuid = $scope.task.check_lists[i + 1].uuid;
                            $scope.currentCheckList.index = i + 1;
                        } else {
                            $scope.currentCheckList.uuid = $scope.task.check_lists[i].uuid;
                            $scope.currentCheckList.index = i;
                        }
                        return;
                    }
                }
                $scope.completeCheckList = "";
                $scope.currentCheckList.uuid = $scope.task.check_lists[0].uuid;
                $scope.currentCheckList.index = 0;
            }
        }

        // Click the dot to switch task.
        $scope.loadTask = function(params) {
            if (params.task === $scope.taskSession.source.current_task_uuid) { return; }

            $scope.studyLayerFunc(true);
            RestFul.global(
                {"action": "WorkspaceCenter:LoadTask", "params": params},
                function(response) {
                    if (!response) {
                        $scope.studyLayerFunc(false);
                        return;
                    };
                    if (response.hasOwnProperty('message')) {
                        $scope.task = response.data;
                        $scope.taskSession = response.data.position;
                        if ($scope.task.check_lists && $scope.task.check_lists.length !== 0) {
                            getCheckListStatus();
                        }
                        $timeout(function() {
                            if (GLOBAL_VAR.fullScreenTopic.indexOf($scope.task.tringtype) === -1) {
                                $scope.isFullScreen = true;
                            } else {
                                $scope.isFullScreen = false;
                                $timeout(function() {
                                    $scope.toStudyDocs();
                                }, 0)
                            }
                        }, 0)
                        $timeout(function() {
                            $scope.taskTemplate = '';
                        }, 0)
                        $timeout(function() {
                            $scope.taskTemplate = 'app/views/learn/study/trings/' + $scope.task.tringtype + '.html';
                        }, 0)

                        if (params.stage || params.part) {
                            if ($scope.taskSession.origin === 'plan') {
                                // Get Plan sub course detail
                                RestFul.global(
                                    {
                                        "action": "OnlineLearning:PlanSubDetail",
                                        "params": {
                                            "plan": $scope.taskSession.source.current_plan_uuid,
                                            "subcourse_type": $scope.taskSession.source.current_subcourse_type,
                                            "subcourse_uuid": $scope.taskSession.source.current_course_uuid,
                                        }
                                    },
                                    function(response) {
                                        if (!response) {
                                            $scope.studyLayerFunc(false);
                                            return;
                                        };
                                        if (response.hasOwnProperty('message')) {
                                            $scope.course = response.data;
                                            part_index = $scope.course.parts_index.indexOf($scope.taskSession.source.current_part_uuid);
                                            $scope.part = $scope.course.parts[part_index];
                                            stage_index = $scope.part.stages_index.indexOf($scope.taskSession.source.current_stage_uuid);
                                            $scope.stage = $scope.part.stages[stage_index];
                                            $timeout(function() {
                                                $scope.tasks = $scope.stage.tasks;
                                            }, 0);
                                            course_index = $scope.plan.subcourses_index.indexOf($scope.course.uuid);
                                            $scope.plan.subcourses[course_index] = angular.copy($scope.course);
                                        }
                                    }
                                )
                            } else if ($scope.taskSession.origin === 'course') {
                                part_index = $scope.course.parts_index.indexOf($scope.taskSession.source.current_part_uuid);
                                $scope.part = $scope.course.parts[part_index];
                                stage_index = $scope.part.stages_index.indexOf($scope.taskSession.source.current_stage_uuid);
                                $scope.stage = $scope.part.stages[stage_index];
                                $timeout(function() {
                                    $scope.tasks = $scope.stage.tasks;
                                }, 0);
                            } else if ($scope.taskSession.origin === 'project') {
                                stage_index = $scope.project.stages_index.indexOf($scope.taskSession.source.current_stage_uuid);
                                $scope.stage = $scope.project.stages[stage_index];
                                $timeout(function() {
                                    $scope.tasks = $scope.stage.tasks;
                                }, 0);
                            }

                            // Get current tasks progress.
                            RestFul.global(
                                currentProgressApi,
                                function(response) {
                                    if (!response) {
                                        $scope.studyLayerFunc(false);
                                        return;
                                    };
                                    if (response.hasOwnProperty('message')) {
                                        $scope.currentStudyProgress = response.data;
                                        $scope.completed_tasks = [];
                                        if ($scope.taskSession.origin === 'plan' || $scope.taskSession.origin === 'course' || $scope.taskSession.origin === 'project') {
                                            if (response.data.progress.stages_achievement[$scope.taskSession.source.current_stage_uuid]) {
                                                $scope.completed_tasks = response.data.progress.stages_achievement[$scope.taskSession.source.current_stage_uuid].completed_tasks_uuid;
                                                $scope.stageProgress = response.data.progress.stages_achievement[$scope.taskSession.source.current_stage_uuid].completed_percentage;
                                            } else {
                                                $scope.stageProgress = 0;
                                            }
                                        } else {
                                            $scope.stageProgress = $scope.currentStudyProgress.completed_percentage;
                                            for (i in $scope.currentStudyProgress.progress.tasks_achievement) {
                                                if ($scope.currentStudyProgress.progress.tasks_achievement[i].is_completed) {
                                                    $scope.completed_tasks.push(i);
                                                }
                                            }
                                        }
                                    }
                                }
                            )
                            $scope.studyLayerFunc(false);
                        }
                        $scope.studyLayerFunc(false);
                    }
                }
            )

            // if (params.hasOwnProperty("stage") || params.hasOwnProperty("part") || params.hasOwnProperty("course")) {
            //     $scope.getStudyQas();
            //     $scope.currentQaDetail = false;
            //     $scope.showQaWindow = false;
            // }
        }

        // Submit user learning record.
        $scope.gotIt = function(next) {
            RestFul.global(
                {"action": "WorkspaceCenter:GotIt", "params": {}},
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        // Completed task to come up with a list of
                        RestFul.global(
                            currentProgressApi,
                            function(response) {
                                if (!response) { return; };
                                if (response.hasOwnProperty('message')) {
                                    $scope.oldCurrentStudyProgress = angular.copy($scope.currentStudyProgress);
                                    $scope.currentStudyProgress = response.data;
                                    $scope.completed_tasks = [];
                                    stageIsCompleted = false;
                                    if ($scope.taskSession.origin === 'plan' || $scope.taskSession.origin === 'course' || $scope.taskSession.origin === 'project') {
                                        if (response.data.progress.stages_achievement[$scope.taskSession.source.current_stage_uuid]) {
                                            $scope.completed_tasks = response.data.progress.stages_achievement[$scope.taskSession.source.current_stage_uuid].completed_tasks_uuid;
                                            $scope.stageProgress = response.data.progress.stages_achievement[$scope.taskSession.source.current_stage_uuid].completed_percentage;
                                            // if ($scope.oldCurrentStudyProgress.progress.stages_achievement[$scope.taskSession.source.current_stage_uuid].is_completed && $scope.currentStudyProgress.progress.stages_achievement[$scope.taskSession.source.current_stage_uuid].is_completed) {
                                            //     stageIsCompleted = true;
                                            // }
                                        } else {
                                            $scope.stageProgress = 0;
                                        }

                                    } else {
                                        // if ($scope.oldCurrentStudyProgress.is_completed && response.data.is_completed) {
                                        //     stageIsCompleted = true;
                                        // }
                                        $scope.stageProgress = response.data.completed_percentage;
                                        for (i in response.data.progress.tasks_achievement) {
                                            if (response.data.progress.tasks_achievement[i].is_completed) {
                                                $scope.completed_tasks.push(i);
                                            }
                                        }
                                    }

                                    // Show Stage Completed window
                                    if ($scope.stage.tasks_index.indexOf($scope.taskSession.source.current_task_uuid) + 1 === $scope.stage.tasks_index.length) {
                                    // if ($scope.stageProgress >= 80 && !stageIsCompleted) {
                                        $scope.studyStatus();
                                    }
                                }
                                if (next) {
                                    $scope.goNext($scope.taskSession.source.current_task_uuid);
                                }
                            }
                        )
                    }
                }
            )
        }

        // Go next the topic
        $scope.goNext = function(uuid) {
            for (index=0; index<$scope.tasks.length; index++) {
                if ($scope.tasks[index].uuid === uuid && index !== $scope.tasks.length - 1) {
                    next_uuid = $scope.tasks[index + 1].uuid;
                    $scope.loadTask({'task': next_uuid});
                    break;
                }
            }
        }

        $scope.studyRightbar = function() {
            if ($scope.socketLayer) { return; }
            var uibModalInstance = $uibModal.open({
                templateUrl: 'app/views/learn/study/study-right-bar.html',
                scope: $scope,
                backdrop: 'false',
                keyboard: false,
                size: 'md',
                windowClass: 'animated fadeInRight study-rightbar__modal',
                backdropClass: 'study-rightbar__backdrop',
                controller: StudyRightBarController,
            });
        }

        $scope.showStudyQaBox = function() {
            $scope.showStudyQa = !$scope.showStudyQa;
        }

        $scope.$on("angular-resizable.resizeStart", function (event, args) {
            angular.element("#" + args.id).parent().find('iframe').css('pointer-events', 'none');
        });
        $scope.$on("angular-resizable.resizeEnd", function (event, args) {
            angular.element("#" + args.id).parent().find('iframe').css('pointer-events', 'auto');
        });

        // $scope.$on("angular-resizable.resizing", function (event, args) {
        //     // Left <--> Right
        //     window_width = angular.element(window).width();
        //     window_height = angular.element(window).height();
        //     if (args.id === 'study-left-box') {
        //         if (args.width) {
        //             if (args.width < window_width * 0.15) {
        //                 $scope.doc = false;
        //                 $scope.check = false;
        //                 angular.element(".study-left-box .rg-right").css('cursor', 'e-resize');
        //             } else if (args.width > window_width * 0.58) {
        //                 angular.element(".study-left-box .rg-right").css('cursor', 'w-resize');
        //             } else {
        //                 if (window_height * 0.2 > angular.element("#study-docs-box").height()) {
        //                     $scope.doc = false;
        //                     $scope.check = true;
        //                 } else if (window_height * 0.7 < angular.element("#study-docs-box").height()) {
        //                     $scope.doc = true;
        //                     $scope.check = false;
        //                 } else {
        //                     $scope.doc = true;
        //                     $scope.check = true;
        //                 }
        //                 angular.element(".study-left-box .rg-right").css('cursor', 'col-resize');
        //             }
        //             event.currentScope.$apply();
        //         }
        //     }
        // });

        // The choice and fillin use slick to auto resize width.
        $scope.$on("angular-resizable.resizing", function(event, args) {
            if ($scope.task.tringtype === 'choice' || $scope.task.tringtype === 'fillin') {
                $(".slick-slider").slick('setPosition');
            }
        });
        $scope.toStudyDocs = function() {
            container = angular.element('#study-left-nav__container');
            study_docs = angular.element('#study-docs-container');
            container.scrollTo(study_docs, 0, 200);
        }
        $scope.toStudyTask = function() {
            container = angular.element('#study-left-nav__container');
            study_task = angular.element('#study-task-container');
            container.scrollTo(study_task, 0, 300);
        }
        $scope.toStudyCheckList = function(id) {
            container = angular.element('#study-left-nav__container');
            study_task = angular.element('#' + id);
            container.scrollToElement(study_task, 80, 800);
        }

        // Study Status
        // Learning anchor, used to jump to the next stage or part or course
        // There are several situations:
        $scope.studyStatus = function() {
            // stage is completed, the details of the next stage of the show
            function stageFinished(next_uuid) {
                studyStatusTmp = 'app/views/learn/study/status/stage-finished.html';
                next_stage_index = $scope.part.stages_index.indexOf($scope.stage.uuid) + 1;
                next_stage_uuid = $scope.part.stages_index[next_stage_index];
                for (i in $scope.part.stages) {
                    if ($scope.part.stages[i].uuid === next_stage_uuid) {
                        $scope.nextStage = $scope.part.stages[i];
                    }
                }
            }

            // part is completed, the details of the next part of the show
            function partFinished() {
                studyStatusTmp = 'app/views/learn/study/status/part-finished.html';
                nextPartIndex = $scope.course.parts_index.indexOf($scope.part.uuid) + 1;
                $scope.nextPart = $scope.course.parts[nextPartIndex];
            }

            function courseFinished(next_uuid) {
                studyStatusTmp = 'app/views/learn/study/status/course-finished.html';
                for (i=0; i<$scope.plan.subcourses.length; i++) {
                    if ($scope.plan.subcourses[i].uuid === next_uuid) {
                        $scope.nextCourse = $scope.plan.subcourses[i];
                    }
                }
            }

            // Display study template corresponding to the state.
            RestFul.global(
                {"action": "WorkspaceCenter:CurrentStudyStatus", "params": {}},
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        if (response.data.origin === 'plan') {
                            if (response.data.study_status === 100) {
                                studyStatusTmp = 'app/views/learn/study/status/plan-completed.html';
                            } else if (response.data.study_status === 101) {
                                studyStatusTmp = 'app/views/learn/study/status/stage-unfinished.html';
                            } else if (response.data.study_status === 102) {
                                stageFinished();
                            } else if (response.data.study_status === 103) {
                                partFinished();
                            } else if (response.data.study_status === 104) {
                                courseFinished();
                            }
                        } else if (response.data.origin === 'course') {
                            if (response.data.study_status === 100) {
                                studyStatusTmp = 'app/views/learn/study/status/course-completed.html';
                            } else if (response.data.study_status === 101) {
                                $scope.unfinished_tasks = [];
                                if ($scope.stageProgress >= $scope.stage.pass_score) {
                                    for (i=0; i<$scope.tasks.length; i++) {
                                        if (!$scope.tasks[i].is_optional && $scope.completed_tasks.indexOf($scope.tasks[i].uuid) === -1) {
                                            $scope.unfinished_tasks.push($scope.tasks[i]);
                                        }
                                    }
                                }
                                studyStatusTmp = 'app/views/learn/study/status/stage-unfinished.html';
                            } else if (response.data.study_status === 102) {
                                stageFinished();
                            } else if (response.data.study_status === 103) {
                                partFinished();
                            }
                        } else if (response.data.origin === 'project') {
                            if (response.data.study_status === 100) {
                                studyStatusTmp = 'app/views/learn/study/status/project-completed.html';
                            } else if (response.data.study_status === 101) {
                                studyStatusTmp = 'app/views/learn/study/status/stage-unfinished.html';
                            } else if (response.data.study_status === 102) {
                                studyStatusTmp = 'app/views/learn/study/status/stage-finished.html';
                                next_stage_index = $scope.project.stages_index.indexOf($scope.stage.uuid) + 1;
                                next_stage_uuid = $scope.project.stages_index[next_stage_index];
                                for (i in $scope.project.stages) {
                                    if ($scope.project.stages[i].uuid === next_stage_uuid) {
                                        $scope.nextStage = $scope.project.stages[i];
                                    }
                                }
                            }
                        } else if (response.data.origin === 'lab') {
                            if (response.data.study_status === 100) {
                                studyStatusTmp = 'app/views/learn/study/status/lab-completed.html';
                            } else if (response.data.study_status === 101) {
                                studyStatusTmp = 'app/views/learn/study/status/stage-unfinished.html';
                            }
                        } else if (response.data.origin === 'quiz') {
                            if (response.data.study_status === 100) {
                                studyStatusTmp = 'app/views/learn/study/status/quiz-completed.html';
                            } else if (response.data.study_status === 101) {
                                studyStatusTmp = 'app/views/learn/study/status/stage-unfinished.html';
                            }
                        } else if (response.data.origin === 'exercise') {
                            if (response.data.study_status === 100) {
                                studyStatusTmp = 'app/views/learn/study/status/exercise-completed.html';
                            } else if (response.data.study_status === 101) {
                                studyStatusTmp = 'app/views/learn/study/status/stage-unfinished.html';
                            }
                        }
                        $scope.studyProgress = response.data;

                        var uibModalInstance = $uibModal.open({
                            templateUrl: studyStatusTmp,
                            scope: $scope,
                            backdrop: 'false',
                            keyboard: true,
                            windowClass: "study-dialog",
                            controller: 'StudyStatusController',
                        });
                    }
                }
            )
        }

        $scope.backLearnCourse = function() {
            if (!position.hasOwnProperty('origin') || !position.hasOwnProperty('source')) {
                url = "/learn";
            } else {
                if (position.origin === "exercise") {
                    url = "/exercises";
                } else {
                    url = "/learn/" + position.origin + "/detail/?ud=" + position.source[position.origin];
                }
            }

            if ($rootScope.socket) {
                $rootScope.remindLearn.status = true;
            } else {
                $rootScope.remindLearn.status = false;
            }
            $timeout(function() { $location.url(url); }, 300)
        }
    }

    // change click mousedown and iframe enter function
    $scope.idle_refresh = function(event) {
        var openedModal = $uibModalStack.getTop();
        if (!openedModal || openedModal.value.modalDomEl.attr('class').indexOf('idle-quit') === -1) {
            if (!ipCookie('idle')) { ipCookie('idle', new Date().getTime()); }
            else {
                // 上次记录和现在相差多少秒
                var diff_second = (new Date().getTime() - ipCookie('idle')) / 1000;
                if (diff_second >= 180) {
                    ipCookie('idle', new Date().getTime());
                    RestFul.global(
                        {"action": "WorkspaceCenter:Refresh", "params":{}},
                        function(response) {
                            if (!response) { return; }
                        }
                    )
                }
            }
        }
    }
}



/**
 * StudyController - Study
 * used in study.html view
 */
function StudyStatusController($scope, $location, $timeout, $uibModalInstance) {
    $scope.cancel = function() { $uibModalInstance.dismiss('cancel'); }
    $scope.goNextCourse = function() {
        $scope.cancel();
        $timeout(function() {
            $location.url('/learn/course/detail/?ud=' + $scope.plan.uuid + '&ud=' + $scope.nextCourse.uuid);
        }, 500);
    }
}


angular
    .module('appLooker')
    .controller('StudyController', StudyController)
    .controller('StudyStatusController', StudyStatusController)
