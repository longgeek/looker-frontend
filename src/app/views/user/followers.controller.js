/**
 * User Homepage Followers Controller
 *
 * Functions (controllers)
 *  - UserHomePageFollowersController
 */

/**
 * UserHomePageFollowersController
 * use followers.html view
 */
function UserHomePageFollowersController($scope, $state, $rootScope, $stateParams, $timeout, $location, RestFul) {
    var params = {"user": $scope.userinfo.uuid, };
    if ($stateParams.pos) {
        if (isNaN(parseInt($stateParams.pos))) { $stateParams.pos = 1; }
        params.pos = parseInt($stateParams.pos);
    }
    $scope.get_user_followers = function(params) {
        if ($scope.followersLoading) { return; }
        $scope.scrollToNavbar();
        $scope.followersLoading = true;
        RestFul.error(
            {"action": "UserShow:Followers", "params": params},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data) {
                        $timeout(function() {
                            $scope.followers = response.data;
                            $scope.followersLoading = false;
                        }, 300)
                    } else { $scope.followersLoading = false; }
                } else { $scope.followersLoading = false; }
            }
        )
    }
    $scope.get_user_followers(params);

    $scope.add_friend = function(uuid, index) {
        if (uuid === $scope.user.user.uuid) {
            $scope.globalTipsDialog("无法关注自己。");
            return;
        }
        RestFul.error(
            {"action": "FriendManagement:AddFriend", "params": {"friend": uuid}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if ($scope.user.username === $scope.userinfo.username) {
                        $scope.userinfo.following_count += 1;
                    }
                    $scope.followers.follows[index].is_friend = true;
                }
            }
        )
    }
    $scope.remove_friend = function(uuid, index) {
        RestFul.error(
            {"action": "FriendManagement:RemoveFriend", "params": {"friend": uuid}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if ($scope.user.username === $scope.userinfo.username) {
                        $scope.userinfo.following_count -= 1;
                    }
                    $scope.followers.follows[index].is_friend = false;
                }
            }
        )
    }
    $scope.followers_pagination = function() {
        params.pos = $scope.followers.paging.pos;
        $scope.get_user_followers(params);
        $state.go($state.current.name, {"username": $state.params.username, "pos": $scope.followers.paging.pos}, {notify: false});
    }
}

angular
    .module('appLooker')
    .controller('UserHomePageFollowersController', UserHomePageFollowersController)
