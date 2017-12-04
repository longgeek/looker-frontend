/**
 * Lab of labs controllers
 *
 * Functions (controllers)
 *  - LabsWorkspaceController
 */


/**
 * LabsWorkspaceController - List All Labs
 * used in lab list view
 */
function LabsWorkspaceController($scope, RestFul, $uibModal) {
    $scope.BootingStatus = true;
}

angular
    .module('appLooker')
    .controller('LabsWorkspaceController', LabsWorkspaceController)
