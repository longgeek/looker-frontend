/**
 * Study RightBar controllers
 *
 * Functions (controllers)
 *  - StudyRightBarController
 */


/**
 * StudyRightBarController
 * used in study-right-bar view
 */
function StudyRightBarController($scope, RestFul) {
    $scope.getUserBalance();

    // Ticket --------------------------------------
    // Only in tabs in a form,
    // so the ticket operations transplanted to here
    // ---------------------------------------------

    // Get User the all tickets.
    function ticketLists() {
        RestFul.global(
            {"action": "Ticket:MyTickets", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data) {
                    $scope.tickets = response.data.tickets;
                    } else {
                        $scope.tickets = [];
                    }
                }
            }
        )
    }
    ticketLists();

    // view details of ticket
    $scope.ticketDetail = function(uuid) {
        // $scope.showTicket = true;
        // RestFul.global(
        //     {
        //         "action": "Ticket:TicketDetail",
        //         "params": {"ticket": uuid}
        //     },
        //     function(response) {
        //         if (!response) { return; };
        //         if (response.hasOwnProperty('message')) {
        //             $scope.ticket = response.data;
        //         }
        //     }
        // )
    }

    // Go back the ticket lists
    $scope.ticketDetailBack = function() {
        $scope.showTicket = false;
    }

    // Submit the new ticket.
    $scope.newTicket = {"ctype": 'ticket'};
    $scope.replyMsg = {};
    $scope.rightBarForm = function() {
        if ($scope.newTicket.title && $scope.newTicket.content) {
            if ($scope.newTicket.title.length > 40) {
                $scope.globalTipsDialog("工单标题长度不能大于 40 个字符");
                return;
            } else if ($scope.newTicket.content.length > 2048) {
                $scope.globalTipsDialog("工单描述长度不能大于 2048 个字符");
                return;
            }
            RestFul.global (
                {
                    "action": "Ticket:TicketCreate",
                    "params": $scope.newTicket
                },
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $scope.newTicket.title = '';
                        $scope.newTicket.content = '';
                        // $scope.tickets.push(response.data);
                        $scope.tickets.splice(0, 0, response.data);
                        $scope.ticketDetail(response.data.uuid);
                    }
                }
            )
        // Reply the ticket
        } else if ($scope.replyMsg.content) {
            $scope.replyMsg.ticket = $scope.ticket.uuid;
            RestFul.global(
                {"action": "Ticket:TicketReply", "params": $scope.replyMsg},
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $scope.ticket.replies.push(response.data);
                        $scope.replyMsg.content = '';
                    }
                }
            )
        }
    }

    // Make resolved ticket.
    $scope.ticketMakeResolved = function(uuid) {
        RestFul.global(
            {
                "action": "Ticket:TicketMakeResolved",
                "params": {"ticket": uuid}
            },
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $scope.ticket.is_resolved = true;
                    ticketLists();
                }
            }
        )
    }
}


angular
    .module('appLooker')
    .controller('StudyRightBarController', StudyRightBarController)
