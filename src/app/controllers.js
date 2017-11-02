/**
 * Global Controller
 *
 * Functions (controllers)
 *  - MainController
 *  - DialogTicketController
 *  - ImageZoomController
 *  - ImagePreviewController
 *  - StudyIdleQuitController
 *  - StudyIdleBackController
 *  - GlobalTipsDialogController
 *  - NotificationConsumeAllController
 */


/**
 * MainController - App Main controller
 */
function MainController($scope, $auth, $state, $stateParams, $location, $anchorScroll, ipCookie, RestFul, $timeout, $uibModal, $rootScope, $uibModalStack, LearnPosition) {
    $scope.isAuthenticated = function() { return $auth.isAuthenticated(); };

    // Get user info.
    $scope.getUserInfo = function(data) {
        if (data) {
            $scope.user = data;
            ipCookie('user', data, {'path': '/'});
            return;
        }
        if (ipCookie('user')) {
            $scope.user = ipCookie('user');
        } else {
            RestFul.global(
                {"action": "Auth:LoginStatus", "params":{}},
                function(response) {
                    if (response.hasOwnProperty('message')) {
                        if (response.hasOwnProperty('data') && response.data) {
                            $scope.user = response.data;
                            ipCookie("user", $scope.user, {'path': '/'});
                        }
                    }
                }
            )
        }
    }

    // Get user balance
    $scope.getUserBalance = function() {
        RestFul.global(
            {"action": "Account:MyBalance", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $scope.myBalance = response.data;
                }
            }
        )
    }

    // Display footer
    $scope.displayFooter = function() {
        if ($state.is('home.pay')) { return false; }
        else if ($state.includes('home.tickets')) { return false; }
        else if ($state.includes('home.qas.detail')) { return false; }
        else if ($state.includes('home.moments')) { return false; }
        else if ($state.includes('u.homepage')) { return false; }
        else if ($state.includes('notifications')) { return false; }
        else { return true; }
    }

    $scope.dialogTicket = function() {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/tickets/dialog-ticket.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: true,
            controller: 'DialogTicketController',
        });
    }

    $scope.reloadPage = function() {
        window.location.reload();
    }

    // Scroll go to element.
    $scope.scrollGo = function(id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll(id);
        $location.hash(old);
    }

    // Summernote listen paste event
    $scope.summernotePaste = function(evt) {
        var bufferText = ((evt.originalEvent || evt).clipboardData || window.clipboardData).getData('Text');
        if (!bufferText) { return; };
        evt.preventDefault();
        $timeout(function() {
            document.execCommand('insertText', false, bufferText);
        }, 10);
    }
    // Summernote editor config
    $scope.summernoteConfig = {
        "toolbar": false,
        "shortcuts": false,
        "dialogsInBody": false,
        "disableDragAndDrop": true,
    };

    // Click the qa and ticket content image to open dialog
    $scope.summernoteImageZoom = function(event) {
        $scope.currentImage = event;
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/summernote-image-zoom.html',
            scope: $scope,
            backdrop: 'true',
            keyboard: true,
            size: 'lg',
            windowClass: 'summernote-image-window',
            controller: 'ImageZoomController',
            resolve: {"event": event},
        });
    }

    // 图片预览，用于工单附件
    $scope.imagePreview = function(name, link) {
        $scope.imagePreviewInfo = {"name": name, "link": link};
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/image-preview.html',
            scope: $scope,
            backdrop: 'true',
            keyboard: true,
            size: 'md',
            windowClass: 'image-preview-window',
            controller: 'ImagePreviewController',
        });
    }

    // txt 文本预览，用于工单附件
    $scope.textPreview = function(name, link) {
        $scope.textPreviewInfo = {"name": name, "link": link};
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/text-preview.html',
            scope: $scope,
            backdrop: 'true',
            keyboard: true,
            size: 'md',
            windowClass: 'text-preview-window',
            controller: 'TextPreviewController',
        });
    }

    $scope.scrollToTop = function(top) {
        if (!top) { top = 0 }
        $("html, body").animate({ scrollTop: top }, 300);
    }

    $scope.scrollToBottom = function(sleep) {
        if (!sleep) {
            $("html, body").scrollTop( $("body")[0].scrollHeight );
        } else {
            $("html, body").animate({ scrollTop: $("body")[0].scrollHeight}, sleep);
        }
    }
    $scope.modalScrollToBottom = function() {
        $("body.modal-open .modal").scrollTop( $("body.modal-open .modal ")[0].scrollHeight );
    }

    // Close has opened modal
    $scope.closeModal = function() {
        var openedModal = $uibModalStack.getTop();
        if (openedModal) {
            $uibModalStack.dismiss(openedModal.key);
        }
    }
    $scope.studyQuit = function(quit) {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/learn/study/study-quit.html',
            scope: $scope,
            backdrop: 'static',
            keyboard: false,
            windowClass: 'study-dialog',
            resolve: { autoQuit: function() { return quit; } },
            controller: StudyQuitController,
        });
    }
    $scope.getStudyWorkspace = function() {
        RestFul.global(
            {"action": "WorkspaceCenter:Status", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data.state === 'RUNNING') {
                        LearnPosition.learn_position = {
                            "origin": response.data.origin,
                            "source": response.data.source,
                        }
                        $rootScope.remindLearn.status = true;
                        $rootScope.remindLearn.origin = response.data.origin;
                        if (response.data.origin === 'plan') {
                            params = {
                                "action": "OnlineLearning:PlanDetail",
                                "params": {"plan": response.data.source.plan}
                            }
                        } else if (response.data.origin === 'course') {
                            params = {
                                "action": "OnlineLearning:CourseDetail",
                                "params": {"course": response.data.source.course}
                            }
                        } else if (response.data.origin === 'project') {
                            params = {
                                "action": "OnlineLearning:ProjectDetail",
                                "params": {"project": response.data.source.project}
                            }
                        } else if (response.data.origin === 'lab') {
                            params = {
                                "action": "OnlineLearning:LabDetail",
                                "params": {"lab": response.data.source.lab}
                            }
                        } else if (response.data.origin === 'quiz') {
                            params = {
                                "action": "OnlineLearning:QuizDetail",
                                "params": {"quiz": response.data.source.quiz}
                            }
                        } else if (response.data.origin === 'exercise') {
                            params = {
                                "action": "OnlineLearning:ExerciseDetail",
                                "params": {"exercise": response.data.source.exercise}
                            }
                        }
                        RestFul.global(
                            params,
                            function(response) {
                                if (!response) { return;}
                                if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                                    $rootScope.remindLearn.content = response.data;
                                }
                            }
                        )
                    } else { $rootScope.remindLearn.status = false; }
                } else { $rootScope.remindLearn.status = false; }
            }
        )
    }

    // Go to th study page
    $scope.goToStudy = function(position) {
        if ($stateParams.pd) { position.source.plan = $stateParams.pd; }
        if (position) {LearnPosition.learn_position = position; };
        $location.url('/learn/study');
        ipCookie('learnPosition', LearnPosition.learn_position, {'path': '/'});
    }

    // 通用的提示弹出框
    $scope.globalTipsDialog = function (content) {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/global-tips-dialog.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: false,
            size: 'sm',
            controller: 'GlobalTipsDialogController',
            resolve: { content: function() { return content; } },
        });
    }

    // 检测字符的数量, 包含中文.
    $scope.checkSum = function(chars) {
        var sum = 0;
        for (var i=0; i<chars.length; i++) {
            var c = chars.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                sum++;
            } else {
                sum += 2;
            }
        }
        return sum;
    }

    // 消息提示音
    $scope.playAudio = function(){
        $timeout(function() { document.getElementById("audio-submit-delivered").play(); }, 0)
    }

    // 获取离线时候的消息通知
    $scope.get_global_notification_historys = function() {
        RestFul.global(
            {"action": "Account:MyMessageLate", "params": {}},
            function(response) {
                if (response && response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                    $scope.notification_historys = response.data;
                    if (Object.getOwnPropertyNames(response.data).length > 0) {
                        $timeout(function() { $scope.playAudio(); }, 0);
                    }
                }
            }
        )
    }

    // 轮询在线消息
    $scope.get_global_notifications = function() {
        RestFul.global(
            {"action": "Account:MyMessagePolling", "params": {}},
            function(response) {
                if (response && response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                    // 判断是否有新的通知，播放通知提示音
                    if ($scope.original_notifications !== undefined) {
                        r_len = Object.getOwnPropertyNames(response.data).length;
                        h_len = Object.getOwnPropertyNames($scope.notification_historys).length;
                        o_len = Object.getOwnPropertyNames($scope.original_notifications).length;
                        if (
                            $scope.original_notifications !== undefined &&
                            h_len + o_len !== h_len + r_len && h_len + o_len < h_len + r_len
                        ) { $scope.playAudio(); }
                    }

                    // 合并在线消息和离线消息
                    var qas = {};
                    var tickets = {};
                    var data = Object.assign($scope.notification_historys, response.data);

                    // original_notifications 为原始 API 返回的数据
                    // 在工单详情 watch 用到
                    $scope.original_notifications = angular.copy(response.data);
                    $scope.notifications = {"total": 0, "values": {}};

                    // 整合同一个工单下的所有回复通知
                    for (k in data) {
                        if (data[k].ctype === "ticket:replied") {
                            td = data[k].params.ticket.uuid;
                            if (Object.getOwnPropertyNames(tickets).indexOf(td) === -1) {
                                tickets[td] = [k];
                            } else { tickets[td].push(k); }
                        }
                        else if (data[k].ctype === "ticket:new" || data[k].ctype === "ticket:resolved" || data[k].ctype === "ticket:attached" || data[k].ctype === "ticket:accepted") {
                            $scope.notifications.values[k] = data[k];
                        }
                        // 问答处理
                        else if (data[k].ctype === "studyqa:replied") {
                            qd = data[k].params.studyqa.uuid;
                            if (Object.getOwnPropertyNames(qas).indexOf(qd) === -1) {
                                qas[qd] = [k];
                            } else { qas[qd].push(k); }
                        }
                        else if (data[k].ctype === "studyqa:new" || data[k].ctype === "studyqa:resolved" || data[k].ctype === "studyqa:attached" || data[k].ctype === "studyqa:accepted") {
                            $scope.notifications.values[k] = data[k];
                        }
                        else {
                            $scope.notifications.values[k] = data[k];
                        }
                    }

                    // 合并一个工单、问答下的多个回复通知为一个通知
                    // notifications_uuids 保存了该工单、问答回复的多个通知 uuid
                    for (k in tickets) {
                        nd = tickets[k][tickets[k].length - 1];
                        $scope.notifications.values[nd] = data[nd];
                        $scope.notifications.values[nd]["notification_uuids"] = tickets[k];
                    }
                    for (k in qas) {
                        nd = qas[k][qas[k].length - 1];
                        $scope.notifications.values[nd] = data[nd];
                        $scope.notifications.values[nd]["notification_uuids"] = qas[k];
                    }
                    $scope.notifications.total = Object.getOwnPropertyNames($scope.notifications.values).length;
                    $timeout(function() {
                        if ($scope.isAuthenticated) { $scope.get_global_notifications(); }
                    }, 2000);
                }
            }
        )
    }

    // 消费消息
    $scope.notification_consume = function(k, v, go) {
        if (v.ctype === "ticket:replied" || v.ctype === "studyqa:replied") {
            messages = v.notification_uuids;
        } else {
            messages = [k];
        }
        RestFul.global(
            {"action": "Account:MyMessageConsume", "params": {"messages": messages}},
            function(response) {
                if (response && response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                    $timeout(function() {
                        for (m in messages) {
                            if ($scope.notification_historys.hasOwnProperty(messages[m])) {
                                delete $scope.notification_historys[messages[m]];
                            }
                        }
                        delete $scope.notifications.values[k];
                        $scope.notifications.total -= 1;
                    }, 0)
                    if (!go) { return; }
                    if (v.ctype === "ticket:replied") {
                        if ($state.is("study")) {
                            url = $state.href("home.tickets", {"ud": v.params.ticket.uuid});
                            window.open(url,'_blank');
                        } else {
                            $state.go("home.tickets", {"ud": v.params.ticket.uuid}, {notify: true, reload: true});
                        }
                    }
                    else if (v.ctype === "ticket:new" || v.ctype === "ticket:resolved" || v.ctype === "ticket:attached" || v.ctype === "ticket:accepted") {
                        if ($state.is("study")) {
                            url = $state.href("home.tickets", {"ud": v.params.ticket.uuid});
                            window.open(url,'_blank');
                        } else {
                            $state.go("home.tickets", {"ud": v.params.uuid}, {notify: true, reload: true});
                        }
                    }
                    else if (v.btype === "studyqa") {
                        if ($state.is("study")) {
                            $scope.get_study_qa_detail(v.params.studyqa.uuid);
                        } else {
                            $state.go("home.qas.detail", {"ud": v.params.studyqa.uuid}, {notify: true, reload: true});
                        }
                    }
                    else if (v.btype === "friend") {
                        $state.go("u.homepage.following", {"username": v.params.friend_uuid}, {notify: true, reload: true});
                    }
                    else if (v.btype === "moment") {
                        $state.go("home.moments.detail", {"ud": v.params.moment_id}, {notify: true, reload: true});
                    }
                }
            }
        )
    }

    // 消费所有消息
    $scope.notification_consume_all = function() {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/topnavbar/notifications/notification-consume-all.html',
            scope: $scope,
            backdrop: 'true',
            keyboard: true,
            size: 'sm',
            controller: 'NotificationConsumeAllController',
        });
    }
    // 在 study 控制台中获取 QA 详情
    $scope.get_study_qa_detail = function(uuid) {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/learn/study/qas/detail.html',
            scope: $scope,
            backdrop: false,
            keyboard: false,
            size: 'lg',
            controller: 'StudyQasDetailController',
            windowClass: 'study-qas-detail-window',
            resolve: { uuid: function() { return uuid; } },
        });
    }

    // 用 dropdown 显示用户基本信息
    // 根据元素的位置判断 dropdown 向上或向下显示
    $scope.showUserDropdown = function(event, username, data) {
        // 处理冒泡事件
        if (event.target.tagName === "A") { parent_element = angular.element(event.target.parentElement); }
        else if (event.target.tagName === "IMG") { parent_element = angular.element(event.target.parentElement.parentElement); }

        // dropdown 到可视顶部的距离 - 当前 scroll 滚动了多少距离
        position = angular.element(event.target).offset().top - angular.element(document).scrollTop();

        // 判断 dropdown 到顶部的距离是否能完全展示 dropdown-menu
        // 添加或移除 .dropup 来控制 dropdown-menu 向上、向下方式展示
        if (position >  200) { parent_element.addClass("dropup"); }
        else { parent_element.removeClass("dropup"); }

        // 调用用户信息 API
        // $scope.userDropdownData = {"data": "", "loading": true, "error": ""};
        // RestFul.error(
        //     {"action": "UserShow:UserInfo", "params": {"account": username}},
        //     function(response) {
        //         if (!response) { return; };
        //         if (response.hasOwnProperty('message')) {
        //             if (response.data) {
        //                 $timeout(function() {
        //                     $scope.userDropdownData.data = response.data;
        //                     $scope.userDropdownData.loading = false;
        //                 }, 100)
        //             } else {
        //                 $scope.userDropdownData.error = "API 返回数据为空";
        //                 $scope.userDropdownData.loading = false;
        //             }
        //         }
        //         else if (response.hasOwnProperty('warning')) {
        //             $scope.userDropdownData.loading = false;
        //             $scope.userDropdownData.error = "用户没有找到。";
        //         }
        //     }
        // )
        $scope.userDropdownData = {"data": data, "loading": false, "error": ""};
        $scope.dropdown_add_friend = function(uuid) {
            if (uuid === $scope.user.user.uuid) {
                $scope.globalTipsDialog("无法关注自己。");
                return;
            }
            RestFul.error(
                {"action": "FriendManagement:AddFriend", "params": {"friend": uuid}},
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $scope.userDropdownData.data.is_friend = true;
                    }
                }
            )
        }
        $scope.dropdown_remove_friend = function(uuid) {
            RestFul.error(
                {"action": "FriendManagement:RemoveFriend", "params": {"friend": uuid}},
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $scope.userDropdownData.data.is_friend = false;
                    }
                }
            )
        }
    }

    if ($scope.isAuthenticated()) {
        $scope.get_global_notification_historys();
        $timeout(function() { $scope.get_global_notifications(); }, 1000);
        $scope.getUserInfo();
        $scope.getStudyWorkspace();
    }
}


/**
 * DialogTicketController - dialog ticket controller
 * use dialog-ticket.html view
 */
function DialogTicketController($scope, $state, $rootScope, $timeout, $location, $uibModalInstance, RestFul) {
    $rootScope.dialogTicketSend = false;
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.dialogTicketContent = {
        "ctype": "ticket",
        "title": "Report Bug: 服务器内部出现异常",
        "content": angular.toJson($rootScope.dialogTicketData),
    };
    $scope.dialogTicketSubmit = function() {
        if ($scope.dialog_ticket_form.$valid && $scope.dialogTicketContent.content) {
            $scope.dialogTicketSending = true;
            RestFul.global(
                {"action": "Ticket:TicketCreate", "params": $scope.dialogTicketContent},
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $scope.dialogTicketResponse = response.data;
                        $rootScope.dialogTicketSend = true;
                        $timeout(function() {
                            $scope.dialogTicketSending = false;
                        }, 1000);
                    }
                }
            )
        } else {
            $scope.dialog_ticket_form.submitted = true;
        }
    }

    $scope.goTicketPage = function(uuid) {
        if (uuid) { $state.go("home.tickets", {"ud": uuid}); }
        else { $state.go("home.tickets"); }
    }
}


/**
 * ImageZoomController - summernote image zoom controller
 * use summernote-image-zoom.html view
 */
function ImageZoomController($scope, $uibModalInstance) {
    $scope.link = $scope.currentImage.target.src;
    $scope.cancel = function() { $uibModalInstance.dismiss('cancel'); }
}


/**
 * ImagePreviewController - image priview controller
 * use image-preview.html view
 */
function ImagePreviewController($scope, $uibModalInstance) {
    $scope.close = function() { $uibModalInstance.dismiss('cancel'); }
}


/**
 * TextPreviewController - text priview controller
 * use text-preview.html view
 */
function TextPreviewController($scope, $http, $uibModalInstance) {
    $scope.textPreviewInfo.loading = true;
    $scope.close = function() { $uibModalInstance.dismiss('cancel'); }

    $http({
        method: 'GET',
        url: $scope.textPreviewInfo.link,
    }).then(
        function successCallback(response) {
            $scope.textPreviewInfo.content = response.data;
            $scope.textPreviewInfo.loading = false;
        },
        function errorCallback(response) {
            $scope.textPreviewInfo.loading = false;
        }
    )

}


/**
 * StudyIdleQuitController - study idle time quit controler
 * use study-idle-quit.html view
 */
function StudyIdleQuitController($scope, $rootScope, $state, $timeout, $location, $uibModalStack, $uibModalInstance, ipCookie, RestFul) {
    $scope.backLearn = function() {
        $timeout(function() { $location.url('/learn/study'); }, 300)
        $uibModalInstance.dismiss('cancel');
        RestFul.global(
            {"action": "WorkspaceCenter:Refresh", "params":{}},
            function(response) {
                if (!response) { return; }
            }
        )
    }
    $uibModalInstance.result.then(function () {
    }, function() {
        // Listen model to closed
    })
}


/**
 * StudyIdleBackController - study idle time back controler
 * use study-idle-back.html view
 */
function StudyIdleBackController($scope, $timeout, $location, $uibModalInstance) {
    $scope.backLearn = function() {
        $timeout(function() { $location.url('/learn/study'); }, 300)
        $uibModalInstance.dismiss('cancel');
    }
    $uibModalInstance.result.then(function () {
    }, function() {
        // Listen model to closed
    })
}


/**
 * GlobalTipsDialogController - global tips dialog controller
 * use global-tips-dialog.html view
 */
function GlobalTipsDialogController($scope, content, $uibModalInstance) {
    $scope.close = function() { $uibModalInstance.dismiss('cancel'); }
    $scope.globalTipsDialogContent = content;
}


/**
 * NotificationConsumeAllController - 消费所有的消息
 * use notification-consume-all.html view
 */
function NotificationConsumeAllController($scope, $timeout, $uibModalInstance, RestFul) {
    $scope.close = function() { $uibModalInstance.dismiss('cancel'); }
    $scope.submitConsume = function() {
        $scope.consumeLoading = true;
        msgs = Object.assign($scope.notification_historys, $scope.original_notifications);
        messages = Object.getOwnPropertyNames(msgs);

        RestFul.global(
            {"action": "Account:MyMessageConsume", "params": {"messages": messages}},
            function(response) {
                if (!response) { $scope.consumeLoading = false; return; }
                if (response && response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                    $timeout(function() {
                        $scope.consumeLoading = false;
                        $scope.$parent.notification_historys = {};
                        $scope.$parent.notifications = {"total": 0, "values": {}};
                        $scope.close();
                    }, 300)
                } else { $scope.consumeLoading = false; }
            }
        )
    }
}
(function() {
    'use strict';
    angular
        .module('appLooker')
        .controller('MainController', MainController)
        .controller('DialogTicketController', DialogTicketController)
        .controller('ImageZoomController', ImageZoomController)
        .controller('ImagePreviewController', ImagePreviewController)
        .controller('TextPreviewController', TextPreviewController)
        .controller('StudyIdleQuitController', StudyIdleQuitController)
        .controller('StudyIdleBackController', StudyIdleBackController)
        .controller('GlobalTipsDialogController', GlobalTipsDialogController)
        .controller('NotificationConsumeAllController', NotificationConsumeAllController)

})();
