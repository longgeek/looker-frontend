/**
 * Moments Controller
 *
 * Functions (controllers)
 *  - MomentsController
 */

/**
 * MomentsController
 * use moments.html view
 */
function MomentsController($scope, $state, $window, $timeout, $location, $uibModal, RestFul) {
    $scope.$on('$stateChangeSuccess', function() {
        if (!$state.includes("home.moments")) { return; }
        $scope.moments_list();
    })
    $scope.moments_list = function(type) {
        $scope.moments = {"moments": []};
        if ($scope.momentsLoading) { return; }
        $timeout(function() {
            if (angular.element(".section-moments-header").hasClass('fixed')) { $scope.scrollToTop(60); }
            else { $scope.scrollToTop(); }
        }, 0)
        // 当 scroll 自动加载后，点击刷新按钮后
        // 重置 pos 和 scroll 的状态
        if (pos) { pos = 2; $scope.scrollLoading = {"busy": false, "done": false}; }

        params = {};
        if (type) {
            if (type === 'public') { action = "Moment:GetPubMoments"; }
            else if (type === 'my') { action = "Moment:GetMyMoments"; }
            else if (type === 'friend') { action = "Moment:GetFriendMoments"; }
        } else {
            if ($state.is("home.moments")) { action = "Moment:GetPubMoments"; }
            else if ($state.is("home.moments.my")) { action = "Moment:GetMyMoments"; }
            else if ($state.is("home.moments.friend")) { action = "Moment:GetFriendMoments"; }
            else if ($state.is("home.moments.detail")) { return; }
            else if ($state.is("u.homepage.activity")) {
                params = {"user": $scope.userinfo.uuid};
                action = "UserShow:Moments";
            }
        }

        $scope.momentsLoading = true;
        RestFul.global(
            {"action": action, "params": params},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                    $timeout(function() {
                        $scope.momentsLoading = false;
                        $scope.moments = response.data;
                    }, 100)
                }
            }
        )
    }
    if ($state.is("u.homepage.activity")) { $scope.moments_list(); }

    $scope.hot_users_list = function() {
        $scope.hotUsersLoading = true;
        RestFul.global(
            {"action": "Moment:GetMomentTopUsers", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                    $timeout(function() {
                        $scope.hotUsersLoading = false;
                        $scope.hotUsers = response.data;
                    }, 100)
                }
            }
        )
    }
    if (!$state.is("u.homepage.activity")) { $scope.hot_users_list(); }

    $scope.publish_content = {"content": "", "loading": false, "uploading": false};
    $scope.moment_publish = function() {
        if ($scope.publish_content.content) {
            $scope.publish_content.content = angular.element(".section-moments-content .reply textarea").val();
            if ($scope.publish_content.content.length > 256) {
                $scope.globalTipsDialog("消息内容不能超过 256 个字符");
                return;
            }
            $scope.publish_content.loading = true;
            RestFul.global(
                {"action": "Moment:CreateMoment", "params": {"content": $scope.publish_content.content}},
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                        $timeout(function() {
                            $scope.publish_content.loading = false;
                            $scope.publish_content.content = "";
                            $scope.moments.moments.unshift(response.data);
                        }, 300)
                    }
                }
            )
        }
    }

    $scope.moment_publish_preview = function() {
        min_height = angular.element(".reply .write-content").height();
        angular.element(".reply .preview-content").css("min-height", min_height);
        val = angular.element(".reply .write-content textarea").val();
        $scope.publish_content.content = angular.copy(val);
    }

    $scope.moment_delete = function(moment, index) {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/moments/delete.html',
            scope: $scope,
            backdrop: false,
            keyboard: false,
            size: 'sm',
            controller: 'MomentsDeleteController',
            resolve: { momentInfo: function() { return {"moment": moment, "index": index}; } },
        });
    }

    $scope.moment_report = function(moment, reply_id) {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/moments/report.html',
            scope: $scope,
            backdrop: false,
            keyboard: false,
            size: 'sm',
            controller: 'MomentsReportController',
            resolve: { momentReport: function() { return {"moment": moment, "reply_id": reply_id}; } },
        });
    }

    $scope.moment_reply = function(moment, index, event) {
        reply_element = event.target.parentElement.elements;
        reply_content = reply_element[0].value;
        reply_button = angular.element(reply_element[1]);

        if (reply_content) {
            if (reply_content.length > 128) {
                $scope.globalTipsDialog("消息内容不能超过 128 个字符");
                return;
            }
            reply_button.addClass("replying");
            reply_element[0].setAttribute("disabled", "disabled");

            // 拿出所有被 @ 的用户
            reply_to = [];
            ats = reply_content.match(/@([0-9a-zA-Z_*]{3,18})/g);
            for (i in ats) {
                reply_to.push(ats[i].split("@")[1]);
            }

            RestFul.error(
                {
                    "action": "Moment:ReplyMoment",
                    "params": {
                        "moment": moment,
                        "content": reply_content,
                        "reply_to": reply_to,
                    }
                },
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                        $timeout(function() {
                            $scope.replyLoading = false;
                            reply_button.removeClass("replying");
                            reply_element[0].removeAttribute("disabled");
                            $scope.moments.moments[index].replies.unshift(response.data);
                            $scope.moments.moments[index].replies_count += 1;
                            reply_element[0].value = "";
                        }, 300)
                    }
                    else if (response.hasOwnProperty('warning') && response.hasOwnProperty('inner_code')) {
                        if (response.inner_code === 1) {
                            $scope.globalTipsDialog("该动态已被删除，无法回复，请刷新界面。");
                        }
                    }
                }
            )
        }
    }

    // @用户
    $scope.moment_reply_at = function(index, nickname) {
        if (!$state.is("u.homepage.activity") && !$state.is("home.moments.detail")) { index += 1; }
        textarea = angular.element(angular.element(".moments-item")[index]).find(".moments-comment > textarea");
        val = textarea.val();
        text = " @" + nickname + " ";
        if (val.indexOf(text) === -1) {
            textarea.val(val + " @" + nickname + " ");
        }
    }

    $scope.moment_reply_delete = function(reply, moment, reply_index, moment_index) {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/moments/reply-delete.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: false,
            size: 'sm',
            controller: 'MomentsReplyDeleteController',
            resolve: {
                replyInfo: function() {
                    return {
                        "reply": reply,
                        "moment": moment,
                        "reply_index": reply_index,
                        "moment_index": moment_index
                    };
                }
            },
        });
    }

    // 加载更多评论
    $scope.loadReplyComments = function(moment, index, event) {
        pos = parseInt(event.target.getAttribute("data-pos")) + 1;
        event.target.parentElement.children[0].setAttribute("style", "display: block;")
        event.target.parentElement.children[1].setAttribute("style", "display: none;")
        RestFul.error(
            {"action": "Moment:GetMomentReplies", "params": {"moment": moment, "pos": pos,}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                    $timeout(function() {
                        event.target.setAttribute("data-pos", pos);
                        event.target.parentElement.children[0].setAttribute("style", "display: none;")
                        event.target.parentElement.children[1].setAttribute("style", "display: block;")
                        $scope.moments.moments[index].replies = $scope.moments.moments[index].replies.concat(response.data.replies);
                    }, 300)
                }
                else if (response.hasOwnProperty('warning') && response.hasOwnProperty('inner_code')) {
                    if (response.inner_code === 1) {
                        $scope.globalTipsDialog("该动态已被删除，无法加载更多评论，请刷新界面。");
                    }
                    event.target.parentElement.children[0].setAttribute("style", "display: none;")
                    event.target.parentElement.children[1].setAttribute("style", "display: block;")
                }
            }
        )
    }


    // 滚动到底部，自动加载 API
    var pos = 2;
    $scope.scrollLoading = {"busy": false, "done": false};
    $scope.scrollLoadMoments = function() {
        if ($scope.scrollLoading.busy || $scope.scrollLoading.done || !$scope.moments || $scope.moments.moments.length === 0) { return; }
        params = {"pos": pos}
        if ($state.is("home.moments")) { action = "Moment:GetPubMoments"; }
        else if ($state.is("home.moments.my")) { action = "Moment:GetMyMoments"; }
        else if ($state.is("home.moments.friend")) { action = "Moment:GetFriendMoments"; }
        else if ($state.is("u.homepage.activity")) {
            params = {"user": $scope.userinfo.uuid, "pos": pos};
            action = "UserShow:Moments";
        }
        $scope.scrollLoading.busy = true;
        RestFul.global(
            {"action": action, "params": params},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                    if (response.data.moments.length > 0) {
                        $timeout(function() {
                            pos += 1;
                            $scope.scrollLoading.busy = false;
                            $scope.moments.moments = $scope.moments.moments.concat(response.data.moments);
                        }, 10)
                    } else {
                        $timeout(function() {
                            $scope.scrollLoading.done = true;
                            $scope.scrollLoading.busy = false;
                        }, 10)
                    }
                }
            }
        )
    }
}


angular
    .module('appLooker')
    .controller('MomentsController', MomentsController)
