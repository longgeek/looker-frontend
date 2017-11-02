/**
 * Delete Attachment Ticket Controller
 *
 * Functions (controllers)
 *  - DeleteAttachmentTicketController
 */

/**
 * DeleteAttachmentTicketController
 * use delete-attachment.html view
 */
function DeleteAttachmentTicketController($scope, $http, $timeout, $uibModalInstance, RestFul, GLOBAL_VAR) {
    $scope.close = function () { $uibModalInstance.dismiss('cancel'); };

    function delete_attach_api() {
        RestFul.global(
            {
                "action": "Ticket:TicketAttach",
                "params": {
                    "ticket": $scope.ticket.uuid,
                    "target_name": $scope.deleteAttachInfo.target_name,
                    "filename": $scope.deleteAttachInfo.filename,
                    "filepath": $scope.deleteAttachInfo.filepath,
                    "filetype": $scope.deleteAttachInfo.filetype,
                    "add_or_del": false,
                }
            },
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $scope.ticket.attach.sorted.splice($scope.deleteAttachInfo.index, 1);
                    delete $scope.ticket.attach.values[$scope.deleteAttachInfo.target_name];
                    $scope.close();
                } else {
                    $scope.submitLoading = false;
                }
            }
        )
    }
    $scope.submit_delete_attachment = function() {
        $scope.submitLoading = true;
        $http({
            method: 'GET',
            url: GLOBAL_VAR.qiniu.delete_file + "?bucket=" + $scope.ticket.ticket_bucket_name + "&&key=" + $scope.deleteAttachInfo.target_name,
        }).then(
            function successCallback(response) {
                delete_attach_api();
            },
            function errorCallback(response) {
                if (response.status === 631 || response.status === 612) {
                    delete_attach_api();
                } else  { $scope.globalTipsDialog(response.data); }
            }
        );
    }
}

angular
    .module('appLooker')
    .controller('DeleteAttachmentTicketController', DeleteAttachmentTicketController)
