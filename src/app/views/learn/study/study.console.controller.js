/**
 * Learn the Study Console controllers
 *
 * Functions (controllers)
 *  - StudyConsoleController
 */


/**
 * StudyConsoleController - quit learn
 * used in study-workspace-box view
 */
function StudyConsoleController($scope, $sce, $timeout, RestFul, ipCookie) {
    // jQuery ui resizable config
    resizableOption = {
        'aspectRation': false,
        'autoHide': false,
        'handles': 'n, e, s, w',
        'containment': '.study',
        'minWidth': 300,
        'minHeight': 300,
    };
    jQuery.ui.resizable(resizableOption, $(".study-desktop"));
    jQuery.ui.resizable(resizableOption, $(".study-terminal"));
    jQuery.ui.resizable(resizableOption, $(".study-terminal.terminal2"));

    // Fixed resize the iframe slow
    $(function() {
        $('.study-terminal').resizable({
            start: function(event, ui) {
                $('.study-terminal iframe').css('pointer-events', 'none');
            },
            stop: function(event, ui) {
                $('.study-terminal iframe').css('pointer-events', 'auto');
            }
        });
    });

    // Save the user selects the terminal or desktop
    if (ipCookie('ConsoleType')) {
        $scope.CurrentConsoleType = ipCookie('ConsoleType');
    } else {
        $scope.CurrentConsoleType = 'terminal';
    }

    // Terminal tabs
    // default have one tab
    var TerminalUrl;
    var Terminal2Url;
    var TerminalTab = 0;
    var Terminal2Tab = 0;
    $scope.TerminalTabs = [0];
    $scope.Terminal2Tabs = [0];
    $scope.TerminalTabsUrl = {'0': ''};
    $scope.Terminal2TabsUrl = {'0': ''};

    // Add the new bash tab
    $scope.terminalAddTab = function() {
        length = $scope.TerminalTabs.length;
        if (length === 0) {
            $scope.TerminalTabs = [0];
            $scope.TerminalTabsUrl[0] = angular.copy(TerminalUrl);
        } else if (length > 0 && length < 4) {
            if ($scope.TerminalTabs[length - 1 ] < length) {
                $scope.TerminalTabs.push(length);
                $scope.TerminalTabsUrl[length] = '';
            } else {
                $scope.TerminalTabs.push($scope.TerminalTabs[length - 1] + 1);
                $scope.TerminalTabsUrl[$scope.TerminalTabs[length - 1] + 1] = '';
            }
        }
        $timeout(function() { $scope.TerminalIndex = $scope.TerminalTabs.length - 1; })
    }
    $scope.terminal2AddTab = function() {
        length = $scope.Terminal2Tabs.length;
        if (length === 0) {
            $scope.Terminal2Tabs = [0];
            $scope.Terminal2TabsUrl[0] = angular.copy(Terminal2Url);
        } else if (length > 0 && length < 4) {
            if ($scope.Terminal2Tabs[length - 1 ] < length) {
                $scope.Terminal2Tabs.push(length);
                $scope.Terminal2TabsUrl[length] = '';
            } else {
                $scope.Terminal2Tabs.push($scope.Terminal2Tabs[length - 1] + 1);
                $scope.Terminal2TabsUrl[$scope.Terminal2Tabs[length - 1] + 1] = '';
            }
        }
        $timeout(function() { $scope.Terminal2Index = $scope.Terminal2Tabs.length - 1; })
    }

    // Close bash tab function
    $scope.terminalCloseTab = function(index) {
        $scope.TerminalTabs.splice(index, 1);
    }
    $scope.terminal2CloseTab = function(index) {
        $scope.Terminal2Tabs.splice(index, 1);
    }

    // Refresh bash tab content.
    $scope.terminalRefresh = function() {
        if ($scope.TerminalTabs.length === 0) { return; }
        $timeout(function() { $scope.TerminalTabsUrl[TerminalTab] = ''; }, 0)
        $timeout(function() { $scope.TerminalTabsUrl[TerminalTab] = TerminalUrl; }, 10)
    }
    $scope.terminal2Refresh = function() {
        if ($scope.Terminal2Tabs.length === 0) { return; }
        $timeout(function() { $scope.Terminal2TabsUrl[Terminal2Tab] = ''; }, 0)
        $timeout(function() { $scope.Terminal2TabsUrl[Terminal2Tab] = Terminal2Url; }, 10)
    }

    // Display or hidden terminal
    $scope.studyTerminal = function() {
        if ($scope.StudyDesktopShow) {
            $scope.StudyDesktopShow = false;
        }
        if ($scope.StudyTerminal2Show) {
            $scope.StudyTerminal2Show = false;
        }
        $scope.CurrentConsoleType = 'terminal';
        ipCookie('ConsoleType', 'terminal', {'path': '/'});
        $scope.StudyTerminalShow = !$scope.StudyTerminalShow;
        RestFul.global(
            {"action": "WorkspaceCenter:GetWorkspaceConsoles", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    TerminalUrl = $sce.trustAsResourceUrl(response.data.current_console);
                    $scope.TerminalTabsUrl[0] = $sce.trustAsResourceUrl(response.data.current_console);
                }
            }
        )
    }

    // Display or hidden terminal2
    $scope.studyTerminal2 = function() {
        if ($scope.StudyDesktopShow) {
            $scope.StudyDesktopShow = false;
        }
        if ($scope.StudyTerminalShow) {
            $scope.StudyTerminalShow = false;
        }
        $scope.CurrentConsoleType = 'terminal2';
        ipCookie('ConsoleType', 'terminal2', {'path': '/'});
        $scope.StudyTerminal2Show = !$scope.StudyTerminal2Show;
        RestFul.global(
            {"action": "WorkspaceCenter:GetWorkspaceConsole2", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    Terminal2Url = $sce.trustAsResourceUrl(response.data.current_console2);
                    $scope.Terminal2TabsUrl[0] = $sce.trustAsResourceUrl(response.data.current_console2);
                }
            }
        )
    }

    // Display or hidden desktop
    $scope.studyDesktop = function() {
        if ($scope.StudyTerminalShow) {
            $scope.StudyTerminalShow = false;
        }
        if ($scope.StudyTerminal2Show) {
            $scope.StudyTerminal2Show = false;
        }
        $scope.CurrentConsoleType = 'desktop';
        ipCookie('ConsoleType', 'desktop', {'path': '/'});
        $scope.StudyDesktopShow = !$scope.StudyDesktopShow;
    }

    // Switch terminal tab.
    $scope.terminalSelectTab = function(key, index) {
        TerminalTab = key;
        $scope.TerminalIndex = index;
        if (key !== 0) { $scope.TerminalTabsUrl[key] = angular.copy(TerminalUrl); }
    }
    $scope.terminal2SelectTab = function(key, index) {
        Terminal2Tab = key;
        $scope.Terminal2Index = index;
        if (key !== 0) { $scope.Terminal2TabsUrl[key] = angular.copy(Terminal2Url); }
    }

    $scope.$watch('task', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.StudyTerminal2Show = false;
            $scope.Terminal2Tabs = [0];
            $scope.Terminal2TabsUrl = {'0': ''};
        }
    }, true)

}


angular
    .module('appLooker')
    .controller('StudyConsoleController', StudyConsoleController)
