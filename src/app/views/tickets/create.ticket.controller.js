/**
 * Create Ticket Controller
 *
 * Functions (controllers)
 *  - CreateTicketController
 */

/**
 * CreateTicketController - User controller
 * use create-ticket.html view
 */
function CreateTicketController($scope, $timeout, $uibModalInstance, RestFul) {
    $scope.ticketInfo = {"ctype": "ticket", "title": "", "content": ""};
    $scope.close = function () { $uibModalInstance.dismiss('cancel'); };
    $scope.submit_create_ticket = function() {
        $scope.submitLoading = true;
        if ($scope.createticket_form.$valid && $scope.ticketInfo.content) {
            RestFul.global(
                {"action": "Ticket:TicketCreate", "params": $scope.ticketInfo},
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $scope.ticketInfo = {"ctype": "ticket"};
                        $scope.tickets.splice(0, 0, response.data);
                        $scope.ticketDetail(response.data.uuid, 0);
                        $timeout(function() { $scope.submitLoading = false; }, 500)
                        $scope.close();
                    }
                }
            )
        } else {
            $timeout(function() {
                $scope.createticket_form.submitted = true;
                $scope.submitLoading = false;
            }, 200)
        }
    }
}

angular
    .module('appLooker')
    .controller('CreateTicketController', CreateTicketController)
