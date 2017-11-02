/**
 * Invite Controller
 *
 * Functions (controllers)
 *  - InviteController
 *  - InviteDialogController
 */

/**
 * InviteController
 * use invite.html view
 */
function InviteController($scope, $uibModal, RestFul) {
    // Get invite url
    RestFul.global(
        {"action": "Account:InvitationURL", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message')) {
                $scope.inviteUrl = response.data;
            }
        }
    )

    // Get invite users
    $scope.inviteOverviews = {"users": 0, "reward": 0};
    RestFul.global(
        {"action": "Account:InvitationList", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message')) {
                $scope.inviteUsers = response.data;
                if ($scope.inviteUsers.length === 0) { return; };
                for (i in $scope.inviteUsers) {
                    if ($scope.inviteUsers[i].is_registered) {
                        $scope.inviteOverviews.users += 1;
                        if ($scope.inviteUsers[i].return_amount) {
                            $scope.inviteOverviews.reward += $scope.inviteUsers[i].return_amount;
                        }
                    }
                }
            }
        }
    )

    // Send email to invite user
    $scope.sendInvite = function() {
        if ($scope.invite_form.$valid && $scope.inviteEmail) {
            RestFul.error(
                {"action": "Account:InviteUserByEmail", "params": {"email": $scope.inviteEmail}},
                function(response) {
                    if (response.hasOwnProperty('message')) {
                        $scope.inviteEmailSuccess = true;
                    } else if (response.hasOwnProperty('warning')) {
                        if (response.inner_code === 101) {
                            $scope.inviteEmailError = "请输入一个有效的邮箱地址.";
                        } else if (response.inner_code === 102) {
                            $scope.inviteEmailError = "该邮箱已存在, 请重新输入.";
                        } else {
                            $scope.inviteEmailError = response.warning;
                        }
                    }
                }
            )
        } else {
            $scope.invite_form.submitted = true;
        }
    }

    // Invite detail dialog
    $scope.inviteDialog = function() {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/invite/invite-dialog.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: true,
            size: 'sm',
            controller: 'InviteDialogController',
        })
    }
}


/**
 * InviteDialogController
 * use invite-dialog.html view
 */
function InviteDialogController($scope, $uibModalInstance) {
    $scope.inviteDialogCancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}


angular
    .module('appLooker')
    .controller('InviteController', InviteController)
    .controller('InviteDialogController', InviteDialogController)
