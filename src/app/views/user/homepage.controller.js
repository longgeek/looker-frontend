/**
 * User Homepage Controller
 *
 * Functions (controllers)
 *  - UserHomePageController
 */

/**
 * UserHomePageController - User Homepage controller
 * use homepage.html view
 */
function UserHomePageController($scope, $state, $rootScope, $timeout, $location, $uibModal, RestFul) {
    var username = $state.params.username;

    if (username.length <= 18) { params = {"account": username}; }
    else { params = {"user": username}; }

    $scope.get_user_info = function() {
        $scope.userinfoLoading = true;
        RestFul.error(
            {"action": "UserShow:UserInfo", "params": params},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data) {
                        $scope.userinfo = response.data;
                        if ($location.path().indexOf(response.data.username) === -1) {
                            $location.path("/u/" + response.data.username).replace();
                        }
                        $scope.userinfoLoading = false;
                        if ($scope.userinfo.intro) {
                            $rootScope.pageData.description = angular.copy($scope.userinfo.intro);
                        } else {
                            $rootScope.pageData.description = $scope.userinfo.username + "的个人主页";
                        }
                        $scope.get_user_overview(response.data.uuid);
                        $scope.get_user_friends();
                    } else { $scope.userinfoLoading = false; }
                }
                else if (response.hasOwnProperty('warning')) { $state.go("home.404"); }
            }
        )
    }
    $scope.get_user_info();

    $scope.get_user_friends = function() {
        RestFul.error(
            {"action": "UserShow:Following", "params": {"user": $scope.userinfo.uuid}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data) { $scope.userinfo.friends = response.data; }
                }
            }
        )
    }

    $scope.homepage_add_friend = function(uuid) {
        if (uuid === $scope.user.user.uuid) {
            $scope.globalTipsDialog("无法关注自己。");
            return;
        }
        RestFul.error(
            {"action": "FriendManagement:AddFriend", "params": {"friend": uuid}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $scope.userinfo.is_friend = true;
                    $scope.userinfo.followers_count += 1;
                }
            }
        )
    }
    $scope.homepage_remove_friend = function(uuid) {
        RestFul.error(
            {"action": "FriendManagement:RemoveFriend", "params": {"friend": uuid}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $scope.userinfo.is_friend = false;
                    $scope.userinfo.followers_count -= 1;
                }
            }
        )
    }

    $scope.get_user_overview = function(user) {
        $scope.overviewLoading = true;
        $scope.scrollToNavbar();
        RestFul.error(
            {"action": "UserShow:OverView", "params": {"user": user}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data) {
                        $timeout(function() {
                            $scope.overview = response.data;
                            $scope.overviewLoading = false;
                        }, 300)
                    } else { $scope.overviewLoading = false; }
                }
                else if (response.hasOwnProperty('warning')) {
                    $scope.overviewLoading = false;
                }
            }
        )
    }

    $scope.load_user_moments = function() {
        $scope.scrollToNavbar();
        if (!$state.is("u.homepage.activity")) { return; }
        $timeout(function() { $scope.activityLoading = true; }, 0)
        $timeout(function() { $scope.activityLoading = false; }, 1)
    }

    $scope.load_user_following = function() {
        if (!$state.is("u.homepage.following")) { return; }
        $timeout(function() { $scope.loadFollowingLoading = true; }, 0)
        $timeout(function() { $scope.loadFollowingLoading = false; }, 0)
    }

    $scope.load_user_followers = function() {
        if (!$state.is("u.homepage.followers")) { return; }
        $timeout(function() { $scope.loadFollowersLoading = true; }, 0)
        $timeout(function() { $scope.loadFollowersLoading = false; }, 0)
    }

    // 技能详情弹出框
    $scope.skillDetail = function (content) {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/user/skill-detail.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: false,
            size: 'sm',
            controller: 'UserHomePageSkillDetailController',
            backdropClass: 'homepage-modal-backdrop',
            resolve: { content: function() { return content; } },
        });
    }

    $scope.scrollToNavbar = function() {
        $timeout(function() {
            if ($rootScope.pageData.title.indexOf($scope.userinfo.username) === -1) {
                $rootScope.pageData.title = $scope.userinfo.username + " " + $rootScope.pageData.title;
                if ($scope.userinfo.intro) {
                    $rootScope.pageData.description = angular.copy($scope.userinfo.intro);
                } else {
                    $rootScope.pageData.description = $scope.userinfo.username + "的个人主页";
                }
            }
            if (angular.element(".section-user-homepage-header").hasClass('fixed')) { $scope.scrollToTop(60); }
            else { $scope.scrollToTop(); }
        }, 10)
    }


    // // Initialize random data for the demo
    // var now = moment().endOf('day').toDate();
    // var year_ago = moment().startOf('day').subtract(1, 'year').toDate();
    // $scope.example_data = d3.time.days(year_ago, now).map(function (dateElement) {
    //   return {
    //     date: dateElement,
    //     details: Array.apply(null, new Array(Math.floor(Math.random() * 15))).map(function(e, i, arr) {
    //       return {
    //         'name': 'Project ' + Math.floor(Math.random() * 10),
    //         'date': function () {
    //           var projectDate = new Date(dateElement.getTime());
    //           projectDate.setHours(Math.floor(Math.random() * 24))
    //           projectDate.setMinutes(Math.floor(Math.random() * 60));
    //           return projectDate;
    //         }(),
    //         'value': 3600 * ((arr.length - i) / 5) + Math.floor(Math.random() * 3600)
    //       }
    //     }),
    //     init: function () {
    //       this.total = this.details.reduce(function (prev, e) {
    //         return prev + e.value;
    //       }, 0);
    //       return this;
    //     }
    //   }.init();
    // });

    // // Set custom color for the calendar heatmap
    // $scope.color = '#1abc9c';

    // // Set overview type (choices are year, month and day)
    // $scope.overview = 'year';

    // // Handler function
    // $scope.print = function (val) {
    //   console.log(val);
    // };
}

angular
    .module('appLooker')
    .controller('UserHomePageController', UserHomePageController)
