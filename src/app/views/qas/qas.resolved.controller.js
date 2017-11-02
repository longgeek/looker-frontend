/**
 * Resolved QA Controller
 *
 * Functions (controllers)
 *  - QasResolvedController
 */

/**
 * QasResolvedController
 * use close.html view
 */
function QasResolvedController($scope, $timeout, $uibModalInstance, RestFul) {
    $scope.close = function () { $uibModalInstance.dismiss('cancel'); };
    $scope.submit_resolved_qa = function() {
        $scope.submitLoading = true;
        RestFul.global(
            {
                "action": "Ticket:QAMakeResolved",
                "params": {"studyqa": $scope.qa.uuid}
            },
            function (response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $timeout(function() {
                        $scope.qa.is_resolved = true;
                        $scope.submitLoading = false;
                        $scope.close();
                        for (i in $scope.qas) {
                            if ($scope.qas[i].uuid === $scope.qa.uuid) {
                                $scope.qas[i].is_resolved = true;
                                break;
                            }
                        }
                    }, 300)
                } else {
                    toaster.error(response.message);
                    $scope.submitLoading = false;
                }
            }
        )
    }
}

angular
    .module('appLooker')
    .controller('QasResolvedController', QasResolvedController)
