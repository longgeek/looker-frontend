/**
 * Notifications Controller
 *
 * Functions (controllers)
 *  - NotificationsController
 */

/**
 * NotificationsController - notifications controller
 * use notifications.html view
 */
function NotificationsController($scope, $state, $stateParams, $location, $timeout, $location, RestFul) {
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.is("notifications.all")) { type = "all"; }
        else if ($state.is("notifications.qa")) { type = "studyqa"; }
        else if ($state.is("notifications.moment")) { type = "moment"; }
        else if ($state.is("notifications.ticket")) { type = "ticket"; }
        $scope.notifications_list(type);
    })
    $scope.notifications_list = function(type, pos) {
        if (!pos) {
            params = {"btype": type}
            $scope.notificationsLoading = true;
        } else { params = {"btype": type, "pos": pos} }
        RestFul.global(
            {"action": "Account:MyMessages", "params": params},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data) {
                        $timeout(function() {
                            if ($scope.notices) { response.data.paging.num = angular.copy($scope.notices.paging.num); }
                            $scope.notices = response.data;
                            if (!$stateParams.ud) { $scope.notifications_select(0); }
                            $scope.notificationsLoading = false;
                        }, 300)
                    } else {
                        $scope.notices = [];
                    }
                }
            }
        )
    }

    $scope.notifications_select = function(index) {
        $scope.notice = angular.copy($scope.notices.messages[index]);
        if ($scope.notice.is_consumed) { return; }
        // 消费消息
        RestFul.global(
            {"action": "Account:MyMessageConsume", "params": {"messages": [$scope.notice.uuid]}},
            function(response) {
                if (!response) { return; }
                if (response && response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                    $scope.notices.messages[index].is_consumed = true;
                    $scope.get_global_notification_historys();
                }
            }
        )
    }

    $scope.notifications_pagination = function() {
        if ($state.is("notifications.all")) { type = "all"; }
        else if ($state.is("notifications.qa")) { type = "studyqa"; }
        else if ($state.is("notifications.moment")) { type = "moment"; }
        else if ($state.is("notifications.ticket")) { type = "ticket"; }
        $scope.notifications_list(type, $scope.notices.paging.pos);
    }

    // 消费当前分页所有未读消息
    $scope.notifications_consume_pagination = function() {
        var indexs = [];
        var messages = [];
        for (i in $scope.notices.messages) {
            val = $scope.notices.messages[i];
            if (!val.is_consumed) {
                indexs.push(i);
                messages.push(val.uuid);
            }
        }
        if (messages.length === 0) {
            $scope.globalTipsDialog("标记成功");
        } else {
            RestFul.global(
                {"action": "Account:MyMessageConsume", "params": {"messages": messages}},
                function(response) {
                    if (!response) { return; }
                    if (response && response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                        for (i in indexs) { $scope.notices.messages[indexs[i]].is_consumed = true; }
                        $scope.get_global_notification_historys();
                        $scope.globalTipsDialog("标记成功");
                    }
                }
            )
        }
    }
}


angular
    .module('appLooker')
    .controller('NotificationsController', NotificationsController)
