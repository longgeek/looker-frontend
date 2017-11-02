/**
 * Study the check-list controllers
 *
 * Functions (controllers)
 *  - CheckListController
 */


/**
 * CheckListController
 * used in study-checklist.html view
 */
function CheckListController($scope, RestFul) {
}


/**
 * StudyCheckListDiffController
 * used in study-checklist-answer.html view
 */
function StudyCheckListDiffController($scope, RestFul, ipCookie, $uibModalStack) {
    var standard_answer = $scope.task.check_lists[$scope.currentCheckList.index].standard_answer;
    if ($scope.task.tringtype === 'coding' || $scope.task.tringtype === 'webfront' || $scope.task.tringtype === 'webserver' || $scope.task.tringtype === 'javascript') {
        var modelist = ace.require("ace/ext/modelist");
        var filename = standard_answer.filename;
        var mode = modelist.getModeForPath(filename).mode;
        var left_content = standard_answer.content;
        var right_content = $scope.fileObj.content;
    } else {
        if ($scope.task.tringtype === 'ipython') {
            var mode = 'ace/mode/python';
        } else if ($scope.task.tringtype === 'linuxbash') {
            var mode = 'ace/mode/sh';
        }

        var command = ipCookie('command');
        var output = ipCookie('output');
        if (command && command.length !== 0) {
            command = command.join('\n').replace(/\xa0/g, ' ').trim();
        }
        if (output && output.length !== 0) {
            output = output.join('\n').replace(/\xa0/g, ' ').trim();
        }
        if (standard_answer.output) {
            if (standard_answer.output === '__output_ignore__') {
                standard_answer.output = "任意输出即可";
            } else if (standard_answer.output === '__dynamic_and_exist__') {
                standard_answer.output = "输出存在，并且为任意动态内容";
            }
            var left_content = "#标准命令答案: \n\n" + standard_answer.command + "\n\n\n#标准输出:\n\n" + standard_answer.output;
            var right_content = "#标准命令答案: \n\n" + command + "\n\n\n#标准输出:\n\n" + output;
        } else {
            var left_content = "#标准命令答案: \n\n" + standard_answer.command;
            var right_content = "#标准命令答案: \n\n" + command;
        }
    }
    var aceDiffer = new AceDiff({
        mode: mode,
        theme: "ace/theme/tomorrow_night",
        diffGranularity: 'broad',
        showDiffs: true,
        showConnectors: true,
        maxDiffs: 5000,
        left: {
            content: left_content,
            editable: false,
            copyLinkEnabled: true
        },
        right: {
            content: right_content,
            editable: true,
            copyLinkEnabled: false
        }
    });
}


angular
    .module('appLooker')
    .controller('CheckListController', CheckListController)
    .controller('StudyCheckListDiffController', StudyCheckListDiffController)
