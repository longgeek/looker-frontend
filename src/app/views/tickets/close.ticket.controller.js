/**
 * Close Ticket Controller
 *
 * Functions (controllers)
 *  - CloseTicketController
 */

/**
 * CloseTicketController
 * use close-ticket.html view
 */
function CloseTicketController($scope, $timeout, $uibModalInstance, RestFul) {
    $scope.close = function () { $uibModalInstance.dismiss('cancel'); };
    $scope.submit_close_ticket = function() {
        $scope.submitLoading = true;
        RestFul.global(
            {
                "action": "Ticket:TicketMakeResolved",
                "params": {"ticket": $scope.ticket.uuid}
            },
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $timeout(function() {
                        $scope.ticket.is_resolved = true;
                        $scope.tickets[$scope.ticketIndex].is_resolved = true;
                        $scope.close();
                    }, 300)
                }
            }
        )
    }
}

angular
    .module('appLooker')
    .controller('CloseTicketController', CloseTicketController)
