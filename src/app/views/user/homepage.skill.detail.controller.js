/**
 * User Homepage Skill Detail Controller
 *
 * Functions (controllers)
 *  - UserHomePageSkillDetailController
 */

/**
 * UserHomePageSkillDetailController - User Homepage skill detail controller
 * use skill-detail.html view
 */
function UserHomePageSkillDetailController($scope, content, $timeout, $uibModalInstance) {
    $scope.close = function() { $uibModalInstance.dismiss('cancel'); }
}

angular
    .module('appLooker')
    .controller('UserHomePageSkillDetailController', UserHomePageSkillDetailController)
