/**
 * Learn the Study qas controllers
 *
 * Functions (controllers)
 *  - ExercisesWorkspaceCommentsController
 */


/**
 * ExercisesWorkspaceCommentsController - study qa
 * used in study-qa.html view
 */
function ExercisesWorkspaceCommentsController($scope, $timeout, $uibModal, RestFul) {

    // jQuery ui resizable config
    resizableOption = {
        'aspectRation': false,
        'autoHide': false,
        'handles': 'n, e, s, w',
        'containment': '.exercises-ws',
        'minWidth': 300,
        'minHeight': 300,
    };
    jQuery.ui.resizable(resizableOption, $(".study-qa-container"));

    $scope.$watch('stage', function(newValue, oldValue) {
        if (newValue !== oldValue && $scope.classify === 'stage') {
            $scope.study_qas_list();
        }
    }, true)

    RestFul.error(
        {"action": "WorkspaceCenter:JoinedExerciseCommentList", "params": {"exercise": 1}},
        function(response) {
            if (response.hasOwnProperty('message')) {
                $scope.qa = response.data;
            }
        }
    )

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
                    "action": "WorkspaceCenter:JoinedExerciseCommentReply",
                    "params": {"content": $scope.reply.content}},
                function(response) {
                    if (response.data) {
                        $timeout(function() {
                            $timeout(function() { $scope.qa.comments.push(response.data); }, 0)
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
}


angular
    .module('appLooker')
    .controller('ExercisesWorkspaceCommentsController', ExercisesWorkspaceCommentsController)
