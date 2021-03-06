/**
 * Course the tring topic controllers
 *
 * Functions (controllers)
 *  - LinuxBashController
 */


/**
 * LinuxBashController
 * used in linuxbash view
 */
function LinuxBashController($scope, $state, $sce, $uibModal, $uibModalStack, $timeout, RestFul, ipCookie) {
    if ($scope.task.extra_data.linux_bash_url) {
        $scope.frameLayer = true;
        // 判断开始学习时间，到目前为止是否超过 5s
        // 超过 5s 则延时 1s
        // 没超过 5s，说明刚进入学习，则延时 5s
        var diff_second = (new Date().getTime() - $scope.studyLearnTime.start_time) / 1000;
        if (diff_second > 5) {
            $timeout(function() {
                $scope.linuxbashUrl = $sce.trustAsResourceUrl($scope.task.extra_data.linux_bash_url);
            }, 1000)
        } else {
            $timeout(function() {
                $scope.linuxbashUrl = $sce.trustAsResourceUrl($scope.task.extra_data.linux_bash_url);
            }, 5000)
        }
    } else {
        $scope.linuxbashUrl = false;
    }

    if ($scope.completed_tasks && $scope.completed_tasks.indexOf($scope.task.uuid) !== -1) {
        $scope.showMiniWillDone = true;
    }

    var messenger = new Messenger("parent");
    $scope.iframeLoadedCallBack = function() {
        $scope.frameLayer = false;
        var iframe_obj = angular.element("#code-interaction-frame");
        iframe_obj.focus();
        if ($scope.task.check_lists && $scope.task.check_lists.length !== 0 && $scope.completed_tasks.indexOf($scope.taskSession.source.current_task_uuid) === -1) {
            messenger.addTarget(iframe_obj[0].contentWindow, iframe_obj.attr("id"));
            data = JSON.stringify({"topic_type": "linuxbash"});
            messenger.targets[iframe_obj.attr("id")].send(data);

            $scope.command = [];
            $scope.output = [];
            // Listen user enter event
            messenger.listen(function(msg) {
                msg = JSON.parse(msg);
                if (msg.hasOwnProperty("command")) {
                    if (typeof(msg.command) === "object") {
                        $scope.command = msg.command;
                    } else {
                        $scope.command.push(msg.command);
                    }
                }
                if ($scope.command.length !== 0 && msg.hasOwnProperty("output")) {
                    regexp = new RegExp(/(\@[a-z0-9]{12})/);
                    regexp1 = new RegExp(/[#,$]/);
                    if (regexp.test(msg.output) && regexp1.test(msg.output)) {
                        msg_split = msg.output.split(/\r\n/);
                        if (regexp.test(msg_split[msg_split.length - 1])) {
                            msg_split.splice(msg_split.length - 1, 1);
                            $scope.output = $scope.output.concat(msg_split);
                            $scope.linuxbashCheck();
                        } else {
                            // $scope.output.push(msg.output);
                        }
                    } else {
                        if (!/\r\n/.test(msg.output) && msg.output.length !== 2) {
                            $scope.output.push(msg.output);
                        }
                    }
                }
                $scope.$watch('task', function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        messenger.clear();
                    }
                }, true);
                $scope.idle_refresh();
            })
        } else {
            messenger.addTarget(iframe_obj[0].contentWindow, iframe_obj.attr("id"));
            messenger.targets[iframe_obj.attr("id")].send(JSON.stringify("idle-msg"));
            messenger.listen(function(msg) {
                msg = JSON.parse(msg);
                if (msg === 'idle-return') {
                    $scope.idle_refresh();
                }
            })
        }
    }

    function checkCurrent() {
        $scope.command = [];
        $scope.output = [];
        // Check List is ok
        ipCookie("completeCheckList", $scope.currentCheckList.uuid, {'path': '/'});
        $scope.completeCheckList = angular.copy($scope.currentCheckList.uuid);
        // 判断是不是最后一个 check list
        if ($scope.currentCheckList.index === $scope.task.check_lists.length - 1) {
            $scope.toStudyCheckList('study-check-list__' + ($scope.task.check_lists.length - 1));
            angular.element("#study-check-list__" + $scope.currentCheckList.index).attr("class", "success");
            $scope.gotIt();
            messenger.clear();
            if ($scope.showWillDone) {
                $scope.closeWillDone();
            }
            if (!$scope.showMiniWillDone) {
                $scope.showWillDone = true;
            }
        } else {
            $scope.currentCheckList.uuid = $scope.task.check_lists[$scope.currentCheckList.index + 1].uuid;
            $scope.currentCheckList.index = $scope.currentCheckList.index + 1;
            $timeout(function() { $scope.showCheckListOutput = "success"; }, 100)
        }
    }
    submitNumber = 0;
    $scope.linuxbashCheck = function() {
        if (!$scope.linuxbashUrl) { return; };

        $timeout(function() { $scope.showCheckListOutput = false; }, 0);

        // Api params, to check current check list need check required.
        params = {
            "check_required": true,
            "data": {"current_content": {}},
        }
        if ($scope.task.check_lists && $scope.task.check_lists.length !== 0 && $scope.completed_tasks.indexOf($scope.taskSession.source.current_task_uuid) === -1) {
            if ($scope.completeCheckList === $scope.currentCheckList.uuid || !$scope.task.check_lists[$scope.currentCheckList.index].check_required) {
                params.check_required = false;
            } else {
                params.data.check_item = $scope.currentCheckList.uuid;
                params.data.current_content.command = $scope.command;
                params.data.current_content.output = $scope.output;
                params.data.standard_answer = angular.copy($scope.task.check_lists[$scope.currentCheckList.index].standard_answer);
            }
        } else {
            params.check_required = false;
        }

        if ($scope.command && $scope.command.length === 0 && $scope.output && $scope.output.length === 0) {
            if (!params.check_required) {
                $timeout(function() {
                    $scope.showMiniWillDone = false;
                }, 0)
                checkCurrent();
            } else {
                $timeout(function() { $scope.showCheckListOutput = "tips"; }, 100)
            }
            return;
        }

        RestFul.error(
            {
                "action": "WorkspaceCenter:SaveAndExec",
                "params": params,
            },
            function(response) {
                if (!response) { return; }
                if (response.hasOwnProperty('message')) {
                    checkCurrent();
                    submitNumber = 0;
                } else if (response.hasOwnProperty('warning')) {
                    if (response.inner_code === 101 && response.warning) {
                        submitNumber += 1;
                        if (submitNumber >= 3) {
                            $timeout(function() { $scope.showCheckListOutput = "help"; }, 100)
                        } else {
                            $timeout(function() { $scope.showCheckListOutput = "error"; }, 100)
                        }
                        $scope.checkListOutput = response.warning;
                        $scope.toStudyCheckList('study-check-list__' + $scope.currentCheckList.index);
                        angular.element("#study-check-list__" + $scope.currentCheckList.index).attr("class", "error");
                    }
                    ipCookie("command", $scope.command);
                    ipCookie("output", $scope.output);
                    $scope.command = [];
                    $scope.output = [];
                }
            }
        )
    }

    $scope.linuxbashSubmit = function() {
        $timeout(function() { $scope.showCheckListOutput = false; }, 0)
        if (!$scope.task.check_lists[$scope.currentCheckList.index].check_required) {
            checkCurrent();
            return;
        }
        unComplete = [];
        for (i=0; i<$scope.task.check_lists.length; i++) {
            if ($scope.task.check_lists[i].check_required && i >= $scope.currentCheckList.index) {
                unComplete.push(i + 1);
            }
        }
        if (unComplete.length > 0) {
            $scope.unCompleteCheckLists = angular.copy(unComplete);
            $timeout(function() { $scope.showCheckListOutput = "tips"; }, 200)
        } else {
            checkCurrent();
        }
    }

    // Refresh linuxbash frame
    $scope.refreshLinuxbashFrame = function() {
        $scope.linuxbashUrl = "";
        $timeout(function() {
            $scope.frameLayer = true;
            $scope.linuxbashUrl = $sce.trustAsResourceUrl($scope.task.extra_data.linux_bash_url);
        }, 100)
    }

    // Code check output results
    $scope.closeCheckListOutput = function() { $scope.showCheckListOutput = false; }

    // Code will done window to close
    $scope.closeWillDone = function() {
        $scope.showWillDone = !$scope.showWillDone;
        $scope.showMiniWillDone = !$scope.showMiniWillDone;
    }

    // Show check list diff
    $scope.popupCheckListDiff = function() {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/learn/study/study-checklist-diff.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: true,
            size: 'lg',
            windowClass: 'study-checklist-diff__modal',
            backdropClass: 'study-checklist-diff__backdrop',
        });
    }
    // Reset check list
    $scope.resetCheckLists = function() {
        ipCookie("completeCheckList", "", {'path': '/'});
        messenger.clear();
        $scope.loadTask({"task": ""});
        $scope.completed_tasks.splice($scope.completed_tasks.indexOf($scope.taskSession.source.current_task_uuid), 1);
    }
}


angular
    .module('appLooker')
    .controller('LinuxBashController', LinuxBashController)
