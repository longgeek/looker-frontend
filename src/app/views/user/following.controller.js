/**
 * User Homepage Following Controller
 *
 * Functions (controllers)
 *  - UserHomePageFollowingController
 */

/**
 * UserHomePageFollowingController
 * use following.html view
 */
function UserHomePageFollowingController($scope, $state, $rootScope, $stateParams, $timeout, $location, RestFul) {
    var params = {"user": $scope.userinfo.uuid, };
    if ($stateParams.pos) {
        if (isNaN(parseInt($stateParams.pos))) { $stateParams.pos = 1; }
        params.pos = parseInt($stateParams.pos);
    }
    $scope.get_user_following = function(params) {
        if ($scope.followingLoading) { return; }
        $scope.scrollToNavbar();
        $scope.followingLoading = true;
        RestFul.error(
            {"action": "UserShow:Following", "params": params},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data) {
                        $timeout(function() {
                            $scope.following = response.data;
                            $scope.followingLoading = false;
                        }, 300)
                    } else { $scope.followingLoading = false; }
                } else { $scope.followingLoading = false; }
            }
        )
    }
    $scope.get_user_following(params);

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
                    $scope.following.follows[index].is_friend = true;
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
                    $scope.following.follows[index].is_friend = false;
                }
            }
        )
    }
    $scope.following_pagination = function() {
        params.pos = $scope.following.paging.pos;
        $scope.get_user_following(params);
        $state.go($state.current.name, {"username": $state.params.username, "pos": $scope.following.paging.pos}, {notify: false});
    }
}

angular
    .module('appLooker')
    .controller('UserHomePageFollowingController', UserHomePageFollowingController)
