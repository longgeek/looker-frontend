/**
 * Course the tring topic controllers
 *
 * Functions (controllers)
 *  - CodingController
 */


/**
 * CodingController - code editor
 * used in coding.html view
 */
function CodingController($scope, $sce, $uibModal, $timeout, RestFul, ipCookie) {
    var console_delays = [];
    if (!$scope.task.topic_support || !$scope.task.topic_content || !$scope.task.topic_content.files.length) { return; }
    $scope.CodingConsoleData = {"sorted": [], "values": {}};
    $scope.CodingData = angular.copy($scope.task.extra_data);
    $scope.CodingDefaultData = angular.copy($scope.task.topic_content);

    aceEditorId = 0;
    $scope.aceLoaded = function(_editor) {
        aceEditorId += 1;
        // Editor part
        var _session = _editor.getSession();
        var _renderer = _editor.renderer;

        var modelist = ace.require("ace/ext/modelist");
        var filename = $scope.CodingDefaultData.files[aceEditorId - 1].filename;
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
        mode: 'python',
        firstLineNumber: 1,
        onLoad: $scope.aceLoaded,
        // onChange: aceChanged,
        require: ['ace/ext/language_tools'],
        advanced: {
            enableSnippets: false,
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false
        }
    };

    submitNumber = 0;
    // Save or Check Function
    // 1. Determine whether there is an object editor,
    //    not then get the first tab of the object editor
    // 2. Check Code.
    $scope.codingSaveCode = function() {
        if (!$scope.task.topic_content) { return; };

        $timeout(function() {
            $scope.showCheckListOutput = false;
            $scope.disabledSaveBtn = true;
            $scope.CodingConsoleLoad = true;
        }, 0);

        if (!$scope.editor) { $scope.editor = ace.edit("editor_0"); }
        $scope.fileObj.content = $scope.editor.getValue();

        if ($scope.CodingConsoleData.sorted.indexOf($scope.fileObj.filename) === -1) {
            $scope.CodingConsoleData.values[$scope.fileObj.filename] = angular.copy($scope.CodingDefaultData.files[$scope.fileIndex]);
            $scope.CodingConsoleData.sorted.push($scope.fileObj.filename);
        }

        // Set output tab is active.
        $timeout(function(){ $scope.currentConsoleIndex = $scope.CodingConsoleData.sorted.indexOf($scope.fileObj.filename); })

        // Api params, to check current check list need check required.
        params = {
            "check_required": true,
            "save_required": true,
            "exec_required": true,
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
        } else { params.check_required = false; }

        // Save And Exec code.
        RestFul.error(
            {
                "action": "WorkspaceCenter:SaveAndExec",
                "params": params,
            },
            function(response) {
                if (!response) {
                    $scope.disabledSaveBtn = false;
                    $scope.CodingConsoleLoad = false;
                    return;
                }
                if (response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
                    // Get files the exec console url.
                    if ($scope.fileObj.is_exec) {
                        $timeout(function() { $scope.CodingConsoleData.values[$scope.fileObj.filename]["url"] = ""; })
                        // 判断改文件是否已执行
                        // 已执行则console不延时
                        // 没执行过则延时 3.5s
                        if (console_delays.indexOf($scope.fileObj.filename) === -1) {
                            console_delays.push($scope.fileObj.filename);
                            $timeout(function() {
                                $scope.disabledSaveBtn = false;
                                $scope.CodingConsoleLoad = false;
                                $scope.CodingConsoleData.values[$scope.fileObj.filename]["url"] = $sce.trustAsResourceUrl(response.data[$scope.fileObj.filename]);
                            }, 3500)
                        } else {
                            $timeout(function() {
                                $scope.disabledSaveBtn = false;
                                $scope.CodingConsoleLoad = false;
                                $scope.CodingConsoleData.values[$scope.fileObj.filename]["url"] = $sce.trustAsResourceUrl(response.data[$scope.fileObj.filename]);
                            }, 0)
                        }
                    } else {
                        $timeout(function() {
                            $scope.disabledSaveBtn = false;
                            $scope.CodingConsoleLoad = false;
                        }, 0)
                    }

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
                        submitNumber = 0;
                    } else {
                        $scope.gotIt();
                        if ($scope.showWillDone) { $scope.closeWillDone(); }
                        if (!$scope.showMiniWillDone) { $scope.showMiniWillDone = true; }
                    }

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
                    $scope.disabledSaveBtn = false;
                    $scope.CodingConsoleLoad = false;
                }
            },
            function(error) {
                $timeout(function() {
                    $scope.disabledSaveBtn = false;
                    $scope.CodingConsoleLoad = false;
                }, 500)
            }
        )
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
    $scope.codingSelectTab = function(index, file, content) {
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
    $scope.codingResetCode = function() {
        if (!$scope.task.topic_content) { return; }
        if (!$scope.editor) { $scope.editor = ace.edit("editor_0"); }
        $scope.editor.setValue($scope.task.topic_content.files[$scope.fileIndex].content, 0);
    }

    $scope.codingCloseFile = function(index) {
        $scope.CodingDefaultData.files.splice(index, 1);
    }

    $scope.codingReopenFiles = function() {
        aceEditorId = 0;
        $scope.CodingDefaultData = angular.copy($scope.task.topic_content);
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

    // Close all output console windows
    $scope.outputClose = function() {
        $scope.CodingConsoleData.sorted = [];
        $scope.CodingConsoleData.values = {};
    }

    // Close ont output console window.
    $scope.outputOneClose = function(index, filename) {
        $scope.CodingConsoleData.sorted.splice(index, 1);
        delete $scope.CodingConsoleData.values[filename];
    }

    // Refresh current output console window
    $scope.outputRefresh = function(index) {
        url = angular.copy($scope.CodingConsoleData.values[$scope.currentConsole].url);
        $timeout(function() { $scope.CodingConsoleData.values[$scope.currentConsole].url = ""; })
        $timeout(function() { $scope.CodingConsoleData.values[$scope.currentConsole].url = url; }, 10)
    }

    // Select a tab.
    $scope.outputSelect = function(tab, index) {
        $scope.currentConsole = tab;
        $scope.currentConsoleIndex = index;
    }
}


angular
    .module('appLooker')
    .controller('CodingController', CodingController)
