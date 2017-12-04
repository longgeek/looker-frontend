/**
 * Lab of labs controllers
 *
 * Functions (controllers)
 *  - LabsDetailController
 */


/**
 * LabsDetailController - detial
 * used in labs/detail.html  view
 */
function LabsDetailController($scope, RestFul, $uibModal, $stateParams) {
    RestFul.error(
        {"action": "OnlineLearning:LabDetail", "params": {"lab": $stateParams.ud}},
        function(response) {
            if (response.hasOwnProperty('message')) {
                $scope.lab = response.data;
                console.log("LAB: ", $scope.lab);
            }
        }
    )

    $scope.lab_start = function() {
        console.log($scope.lab);
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/labs/create.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: false,
            size: 'sm',
            controller: 'LabsCreateController',
            // resolve: {
            //     replyInfo: function() {
            //         return {
            //             "reply": reply,
            //             "moment": moment,
            //             "reply_index": reply_index,
            //             "moment_index": moment_index
            //         };
            //     }
            // },
        });
    }
}

angular
    .module('appLooker')
    .controller('LabsDetailController', LabsDetailController)
