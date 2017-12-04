/**
 * Course the tring topic controllers
 *
 * Functions (controllers)
 *  - WebController
 */


/**
 * WebController - code editor
 * used in webfront.html view
 */
function WebController($scope, $sce, $uibModal, $timeout, $window, RestFul, ipCookie) {
    if (!$scope.task || !$scope.task.topic_content || !$scope.task.topic_content.files.length) { return; }
    $scope.WebData = angular.copy($scope.task.extra_data);
    $scope.WebDefaultData = angular.copy($scope.task.topic_content);
    // $scope.filePath = "/storage/learn/online_course/" +
    //                   $scope.taskSession.origin + "_" +
    //                   $scope.taskSession.source.current_curriculum_uuid + "/part_" +
    //                   $scope.taskSession.source.current_part_uuid.slice(0, 5) + "/stage_" +
    //                   $scope.taskSession.source.current_stage_uuid.slice(0, 5) + "/task_" +
    //                   $scope.task.uuid.slice(0, 5) + "/";
    $scope.filePath = angular.copy($scope.task.extra_data.learn_root);

    if ($scope.WebData && $scope.WebData.hasOwnProperty('console') && $scope.WebData.console) {
        for (i in $scope.WebData.console) {
            if (i.indexOf('webfront ') !== -1) {
                $scope.WebDefaultUrl = $scope.WebData.console[i];
            }
        }
    }

    aceEditorId = 0;
    $scope.aceLoaded = function(_editor) {
        aceEditorId += 1;
        // Editor part
        var _session = _editor.getSession();
        var _renderer = _editor.renderer;

        var modelist = ace.require("ace/ext/modelist");
        var filename = $scope.WebDefaultData.files[aceEditorId - 1].filename;
        var mode = modelist.getModeForPath(filename).mode;

        // Options
        _editor.setReadOnly(false);
        _editor.setTheme('ace/theme/tomorrow_night');
        _session.setUndoManager(new ace.UndoManager());
        _renderer.setShowGutter(true);
        _editor.getSession().setMode(mode);
        _editor.$blockScrolling = Infinity;
        _editor.commands.bindKey("Ctrl-P", "golineup");
        // Enable vim mode.
        // _editor.setKeyboardHandler('ace/keyboard/vim');


        // Events
        // _session.on("change", function() {
        //     console.log(_editor.getValue());
        // });
        _editor.on('focus', function () {
            $scope.editor = _editor;
        });
    }
    $scope.aceOptions = {
        useWrapMode : false,
        showGutter: true,
        theme:'tomorrow_night',
        mode: 'html',
        firstLineNumber: 1,
        onLoad: $scope.aceLoaded,
        // onChange: aceChanged,
        require: ['ace/ext/language_tools'],
        advanced: {
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        }
    };

    submitNumber = 0;
    $scope.historyUrls = [];
    // Save or Check Function
    // 1. Determine whether there is an object editor,
    //    not then get the first tab of the object editor
    // 2. Check Code.
    $scope.webSaveCode = function() {
        if (!$scope.task.topic_content) { return; };

        $timeout(function() {
            $scope.showCheckListOutput = false;
            $scope.disabledSaveBtn = true;
            $scope.WebConsoleUrl = "";
            $scope.WebConsoleLoad = true;
        }, 0);

        if (!$scope.editor) {
            $scope.editor = ace.edit("editor_0");
        }
        $scope.fileObj.content = $scope.editor.getValue();

        // Api params, to check current check list need check required.
        params = {
            "check_required": true,
            "save_required": true,
            "data": {
                "current_content": {
                    "filename": $scope.fileObj.filename,
                    "content": $scope.fileObj.content,
                }
            }
        }
        if ($scope.task.check_lists && $scope.task.check_lists.length !== 0 && $scope.completed_tasks.indexOf($scope.taskSession.source.current_task_uuid) === -1) {
            if ($scope.completeCheckList === $scope.currentCheckList.uuid || !$scope.task.check_lists[$scope.currentCheckList.index].check_required) {
                params.check_required = false;
            } else {
                params.data.check_item = $scope.currentCheckList.uuid;
                params.data.standard_answer = $scope.task.check_lists[$scope.currentCheckList.index].standard_answer;
            }
        } else {
            params.check_required = false;
        }
        // Save And Exec code.
        RestFul.error(
            {
                "action": "WorkspaceCenter:SaveAndExec",
                "params": params,
            },
            function(response) {
                if (!response) {
                    $scope.disabledSaveBtn = false;
                    $scope.WebConsoleLoad = false;
                    return;
                }
                if (response.hasOwnProperty('message')) {
                    // Check List is ok
                    if ($scope.task.check_lists && $scope.task.check_lists.length !== 0 && $scope.completed_tasks.indexOf($scope.taskSession.source.current_task_uuid) === -1) {
                        ipCookie("completeCheckList", $scope.currentCheckList.uuid, {'path': '/'});
                        $scope.completeCheckList = angular.copy($scope.currentCheckList.uuid);
                        // 判断是不是最后一个 check list
                        if ($scope.currentCheckList.index === $scope.task.check_lists.length - 1) {
                            $scope.toStudyCheckList('study-check-list__' + ($scope.task.check_lists.length - 1));
                            angular.element("#study-check-list__" + $scope.currentCheckList.index).attr("class", "success");
                            $scope.gotIt();
                            if ($scope.showWillDone) { $scope.closeWillDone(); }
                            if (!$scope.showMiniWillDone) { $scope.showWillDone = true; }
                        } else {
                            $scope.currentCheckList.uuid = $scope.task.check_lists[$scope.currentCheckList.index + 1].uuid;
                            $scope.currentCheckList.index = $scope.currentCheckList.index + 1;
                            $scope.showCheckListOutput = "success";
                        }
                    } else {
                        $scope.gotIt();
                        if ($scope.showWillDone) { $scope.closeWillDone(); }
                        if (!$scope.showMiniWillDone) { $scope.showMiniWillDone = true; }
                    }
                    submitNumber = 0;
                } else if (response.hasOwnProperty('warning')) {
                    if (response.inner_code === 101 && response.warning) {
                        submitNumber += 1;
                        if (submitNumber >= 3) {
                            $scope.showCheckListOutput = "help";
                        } else {
                            $scope.showCheckListOutput = "error";
                        }
                        $scope.checkListOutput = response.warning;
                        $scope.toStudyCheckList('study-check-list__' + $scope.currentCheckList.index);
                        angular.element("#study-check-list__" + $scope.currentCheckList.index).attr("class", "error");
                    }
                }
            }
        )

        // Get files the exec console url.
        $timeout(function() {
            $scope.WebConsoleUrl = $scope.WebDefaultUrl + "/" + $scope.fileObj.filename;
            if ($scope.fileObj.filename.indexOf(".html") === -1) {
                for (i in $scope.WebData.files) {
                    if (i.indexOf(".html") !== -1) {
                        $scope.WebConsoleUrl = $scope.WebDefaultUrl + "/" + i;
                        break;
                    }
                }
            } else {
                $scope.WebConsoleUrl = $scope.WebDefaultUrl + "/" + $scope.fileObj.filename;
            }
            $scope.WebConsoleLoad = false;
            $scope.disabledSaveBtn = false;
            if ($scope.historyUrls.indexOf($scope.WebConsoleUrl) === -1) {
                $scope.historyUrls.push($scope.WebConsoleUrl);
            }
            $scope.userEnterBrowserUrl = angular.copy($scope.WebConsoleUrl);
            $scope.WebConsoleUrl = $sce.trustAsResourceUrl($scope.WebConsoleUrl);
        }, 300);
    }

    // Tab Active Event
    // Get the current editor object
    function activeEditor(index) {
        $scope.editor = ace.edit("editor_" + index);
        $scope.editor.focus();
        var session = $scope.editor.getSession();
        //Get the number of lines
        var count = session.getLength();
        //Go to end of the last line
        $scope.editor.gotoLine(count, session.getLine(count - 1).length);
    }
    $scope.webSelectTab = function(index, file, content) {
        $scope.fileObj = file;
        $scope.fileObj.content = content;
        $scope.fileIndex = index;
        if (angular.element("#editor_" + index).length === 0) {
            $scope.editor = "";
            $timeout(function() {
                if (angular.element("#editor_" + index).length !== 0) {
                    activeEditor(index);
                }
            }, 100);
        } else {
            activeEditor(index);
        }
    }

    // Code Reset File
    $scope.webResetCode = function() {
        if (!$scope.task.topic_content) { return; }
        if (!$scope.editor) { $scope.editor = ace.edit("editor_0"); }
        $scope.editor.setValue($scope.task.topic_content.files[$scope.fileIndex].content, 0);
    }

    $scope.webCloseFile = function(index) {
        $scope.WebDefaultData.files.splice(index, 1);
    }

    $scope.webReopenFiles = function() {
        aceEditorId = 0;
        $scope.WebDefaultData = angular.copy($scope.task.topic_content);
    }

    $scope.OpenNewBrowserPage = function() {
        $window.open($scope.WebConsoleUrl, "_blank");
    }

    $scope.refreshBrowserPage = function() {
        url = angular.copy($scope.WebConsoleUrl);
        $timeout(function() { $scope.WebConsoleUrl = ""; }, 0);
        $timeout(function() { $scope.WebConsoleUrl = url; }, 10);
    }

    $scope.enterBrowserUrl = function() {
        if (!$scope.userEnterBrowserUrl) { return; }
        $timeout(function() { $scope.WebConsoleUrl = ""; }, 0);
        $timeout(function() {
            if ($scope.userEnterBrowserUrl.indexOf('http://') === -1 && $scope.userEnterBrowserUrl.indexOf('https://') === -1 && $scope.userEnterBrowserUrl.indexOf('ftp://') === -1) {
                $scope.WebConsoleUrl = 'http://' + angular.copy($scope.userEnterBrowserUrl);
            } else {
                $scope.WebConsoleUrl = angular.copy($scope.userEnterBrowserUrl);
            }
            if ($scope.historyUrls.indexOf($scope.WebConsoleUrl) === -1) {
                $scope.historyUrls.push($scope.WebConsoleUrl);
            }
            $scope.WebConsoleUrl = $sce.trustAsResourceUrl($scope.WebConsoleUrl);
        }, 1000);
    }

    $scope.backBrowserPage = function() {
        url = angular.copy($scope.historyUrls[$scope.historyUrls.length - 2]);
        $scope.WebConsoleUrl = $sce.trustAsResourceUrl(url);
        $scope.userEnterBrowserUrl = url;
        $scope.historyUrls = [url];
    }

    // Code check output results
    $scope.closeCheckListOutput = function() {
        $scope.showCheckListOutput = false;
    }

    // Code will done window to close
    $scope.closeWillDone = function() {
        $scope.showWillDone = !$scope.showWillDone;
        $scope.showMiniWillDone = !$scope.showMiniWillDone;
    }

    // Show check list diff
    $scope.popupCheckListDiff = function() {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/learn/study/study-checklist-diff.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: true,
            size: 'lg',
            windowClass: 'study-checklist-diff__modal',
            backdropClass: 'study-checklist-diff__backdrop',
        });
    }
}


angular
    .module('appLooker')
    .controller('WebController', WebController)
