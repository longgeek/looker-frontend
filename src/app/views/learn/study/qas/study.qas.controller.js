/**
 * Learn the Study qas controllers
 *
 * Functions (controllers)
 *  - StudyQasController
 */


/**
 * StudyQasController - study qa
 * used in study-qa.html view
 */
function StudyQasController($scope, $timeout, $uibModal, RestFul) {

    // jQuery ui resizable config
    resizableOption = {
        'aspectRation': false,
        'autoHide': false,
        'handles': 'n, e, s, w',
        'containment': '.study',
        'minWidth': 300,
        'minHeight': 300,
    };
    jQuery.ui.resizable(resizableOption, $(".study-qa-container"));

    $scope.$watch('stage', function(newValue, oldValue) {
        if (newValue !== oldValue && $scope.classify === 'stage') {
            $scope.study_qas_list();
        }
    }, true)

    // Get the current stage the all qas.
    $scope.study_qas_list = function() {
        $scope.qasLoading = true;
        RestFul.global(
            {"action": "WorkspaceCenter:GetStudyQAs", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data) {
                        $timeout(function() {
                            $scope.qas = response.data.studyqas;
                            $scope.qasLoading = false;
                        }, 300)
                    } else {
                        $scope.qas = [];
                        $scope.qasLoading = false;
                    }
                }
            }
        )
    }
    $scope.study_qas_list();

    $scope.my_qas_list = function() {
        $scope.qasLoading = true;
        RestFul.global(
            {"action": "Ticket:MyQAs", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data) {
                        $timeout(function() {
                            $scope.qas = response.data.studyqas;
                            $scope.qasLoading = false;
                        }, 300)
                    } else {
                        $scope.qas = [];
                        $scope.qasLoading = false;
                    }
                }
            }
        )
    }


    // Submit the new qa.
    $scope.newQa = {};
    $scope.submitNewQa = function() {
        if ($scope.newQa.title && $scope.newQa.content) {
            if ($scope.newQa.title.length > 48) {
                $scope.globalTipsDialog("问题标题不能超过 48 个字符");
                return;
            }
            else if ($scope.checkSum($scope.newQa.content > 4096)) {
                $scope.globalTipsDialog("问题内容不能超过 4096 个字符");
                return;
            }
            $scope.newQaLoading = true;
            RestFul.global (
                {
                    "action": "WorkspaceCenter:AskQuestion",
                    "params": {
                        "title": $scope.newQa.title,
                        "content": $scope.newQa.content
                    },
                },
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $timeout(function() {
                            $scope.newQa = {};
                            $scope.qas.push(response.data);
                            $scope.newQaLoading = false;
                            $scope.get_study_qa_detail(response.data.uuid);
                        }, 300)
                    } else {
                        $scope.newQaLoading = false;
                    }
                }
            )
        }
    }
}


angular
    .module('appLooker')
    .controller('StudyQasController', StudyQasController)
