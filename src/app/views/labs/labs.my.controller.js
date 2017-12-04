/**
 * Lab of labs controllers
 *
 * Functions (controllers)
 *  - LabsMyController
 */


/**
 * LabsMyController - List All Labs
 * used in lab list view
 */
function LabsMyController($scope, RestFul, $uibModal) {

    $scope.labs_list = function() {
        RestFul.error(
            {"action": "OnlineLearning:JoinedLabList", "params": {}},
            function(response) {
                if (response.hasOwnProperty('message')) {
                    $scope.my_labs = response.data;
                    console.log("my labs: ", $scope.my_labs);
                }
            }
        )
    }

    $scope.labs_list();


    $scope.my_labs_delete = function(lab) {
        console.log(lab);
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/labs/delete.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: false,
            size: 'sm',
            controller: 'LabsDeleteController',
            resolve: {
                replyInfo: function() {
                    return {
                        "joinedlab": lab,
                    };
                }
            },
        });
    }

    $scope.my_labs_start = function (lab) {
        RestFul.error(
            {
                "action": "WorkspaceCenter:RequestBooting",
                "params": {
                    "origin": "lab",
                    "source": {
                        "lab": $scope.my_labs.values[lab].lab_uuid,
                        "joinedlab": lab,
                    }
                }
            },
            function(response) {
                if (response.hasOwnProperty('message')) {
                    console.log("start: ", response.data);
                }
            }
        )
    }
}

angular
    .module('appLooker')
    .controller('LabsMyController', LabsMyController)
