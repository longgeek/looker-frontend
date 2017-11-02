/**
 * QasDetail Controller
 *
 * Functions (controllers)
 *  - QasDetailController
 */


/**
 * QasDetailController - QA Detail controller
 * use detail.html view
 */
function QasDetailController($scope, $rootScope, $stateParams, $uibModal, $timeout, $location, RestFul) {
    var uuid = $stateParams.ud;

    // 监控该问答是否有新的回复
    $scope.$watch("notifications", function(newValue, oldValue, scope) {
        // 遍历 notifications 所有通知
        if (newValue === undefined || Object.getOwnPropertyNames(newValue).length === 0 || !newValue.hasOwnProperty('values') || !newValue.values) { return }
        for (k in newValue.values) {
            val = newValue.values[k];

            // 判断是否为回复通知、并且和该问答 UUID 一致
            if (val.ctype === "studyqa:replied" && $scope.qa && val.params.studyqa.uuid === $scope.qa.uuid) {
                // 遍历该问答的多个通知 UUID
                for (i in val.notification_uuids) {
                    exist = false;
                    ud = val.notification_uuids[i];
                    o_val = $scope.original_notifications[ud];

                    // 遍历该问答的所有回复
                    // 判断通知的回复 id 是否存在于所有回复中
                    for (j in $scope.qa.replies) {
                        replie = $scope.qa.replies[j];
                        if (o_val.params.reply.id === replie.id) {
                            exist = true; break;
                        }
                    }
                    if (!exist) {
                        $scope.qa.replies.push(o_val.params.reply);
                        $timeout(function() { $scope.scrollToBottom(); }, 0)
                    }
                }
                // 消费该问答的所有回复消息
                $scope.notification_consume(k, val);
            }
            // 问答已解决通知在进入该问答时候，直接消费消息
            else if (val.ctype === "studyqa:resolved" && $scope.qa && val.params.uuid === $scope.qa.uuid) {
                $scope.notification_consume(k, val);
                $scope.qa.is_resolved = true;
            }
            // 问答附件消息通知，新附件和删除附件通知
            else if (val.ctype === "studyqa:attached" && $scope.qa && val.params.studyqa.uuid === $scope.qa.uuid) {
                $scope.notification_consume(k, val);
                if (val.params.add_or_del) {
                    if ($scope.qa.attach === null) {
                        $scope.qa.attach = {"sorted": [], "values": {}};
                    }
                    $scope.qa.attach.sorted.push(val.params.target_name);
                    $scope.qa.attach.values[val.params.target_name] = val.params;
                } else {
                    $scope.qa.attach.sorted.splice($scope.qa.attach.sorted.indexOf(val.params.target_name), 1);
                    delete $scope.qa.attach.values[val.params.target_name];
                }
            }
            // 问答已被工程师接受，开始处理通知。
            else if (val.ctype === "studyqa:accepted" && $scope.qa && val.params.studyqa.uuid === $scope.qa.uuid) {
                $scope.notification_consume(k, val);
                $scope.qa.accepted_by = val.params.accepted_by;
            }
        }
    }, true)

    // 在进入问答详情后，消费该问答所有的消息
    function qa_detail_consume() {
        if ($scope.notifications === undefined || Object.getOwnPropertyNames($scope.notifications).length === 0 || !$scope.notifications.hasOwnProperty('values') || !$scope.notifications.values) { return }
        for (k in $scope.notifications.values) {
            val = $scope.notifications.values[k];
            if (val.ctype === "studyqa:replied" && val.params.studyqa.uuid === $scope.qa.uuid) {
                $scope.notification_consume(k, val);
            }
            else if (val.ctype === "studyqa:resolved" && val.params.uuid === $scope.qa.uuid) {
                $scope.notification_consume(k, val);
            }
            else if (val.ctype === "studyqa:attached" && val.params.studyqa.uuid === $scope.qa.uuid) {
                $scope.notification_consume(k, val);
            }
        }
    }

    $scope.qa_detail = function(uuid) {
        $scope.detailLoading = true;
        RestFul.global(
            {
                "action": "Ticket:QADetail",
                "params": {"studyqa": uuid}
            },
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $rootScope.pageData.title = response.data.title + $rootScope.pageData.title;
                    $rootScope.pageData.description = response.data.content;
                    $timeout(function() {
                        $scope.qa = response.data;
                        qa_detail_consume();
                        $scope.detailLoading = false;
                    }, 300)
                } else {
                    $scope.detailLoading = false;
                }
            }
        )
    }
    $scope.qa_detail(uuid);

    $scope.reply = {"content": "", "loading": false, "uploading": false};
    $scope.qa_reply = function() {
        if ($scope.reply.content) {
            $scope.reply.content = angular.element(".reply textarea").val();
            if ($scope.checkSum($scope.reply.content) > 4096) {
                $scope.globalTipsDialog("消息内容不能超过 4096 个字符");
                return;
            }
            $scope.reply.loading = true;
            RestFul.global(
                {
                    "action": "Ticket:QAReply",
                    "params": {"studyqa": $scope.qa.uuid, "content": $scope.reply.content}},
                function(response) {
                    if (response.data) {
                        $timeout(function() {
                            $timeout(function() { $scope.qa.replies.push(response.data); }, 0)
                            $scope.reply = {"content": ""};
                            $scope.reply.loading = false;
                            $timeout(function() { $scope.scrollToBottom(); }, 0)
                        }, 300)
                    } else {
                        $scope.reply.loading = false;
                        toaster.error(response.message);
                    }
                }
            )
        }
    }
    $scope.qa_make_resolved = function() {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/qas/resolved.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: false,
            size: 'sm',
            controller: 'QasResolvedController',
        });
    }
    $scope.qa_reply_preview = function() {
        min_height = angular.element(".reply .write-content").height();
        angular.element(".reply .preview-content").css("min-height", min_height);
        $scope.reply.content = angular.element(".reply .write-content textarea").val();
    }
}


angular
    .module('appLooker')
    .controller('QasDetailController', QasDetailController)
