(function() {
    'use strict';

    angular
        .module('appLooker')
        .run(appRunning);

    /** @ngInject */
    function appRunning($rootScope, $state, $auth, $uibModalStack, $location, RestFul, ipCookie) {
        $rootScope.$state = $state;
        $rootScope.defaultTitle = ' | 未来图谱';
        $rootScope.remindLearn = {"status": false, "origin": "", "content": "", "quit": false};

        // check user session status
        RestFul.error(
            {"action": "Auth:LoginStatus", "params": {}},
            function(response) {
                if (response.hasOwnProperty('message')) {
                    if (response.data) {
                        ipCookie('user', response.data, {'path': '/'});
                    }
                    if (!response.data && $auth.isAuthenticated()) {
                        $auth.logout().then(function() {
                            ipCookie.remove('user');
                        });
                    }
                }
            }
        )

        // listen url change event, to check opened dialog the close.
        $rootScope.$on('$stateChangeStart', function($event) {
            // Before jumping url, check if there are open modal,
            // There are open modal, then closed model, do not jump url
            var openedModal = $uibModalStack.getTop();
            if (openedModal) {
                if (!!$event.preventDefault) {
                    $event.preventDefault();
                }
                if (!!$event.stopPropagation) {
                    $event.stopPropagation();
                }
                $uibModalStack.dismiss(openedModal.key);
            }
        })
        $rootScope.$on('$stateChangeSuccess', function() {
            $rootScope.pageData = {
                "title":  $state.current.data.pageTitle + $rootScope.defaultTitle,
                "description": $state.current.data.pageDescription,
            }

            // Next url
            if (!$auth.isAuthenticated() && !$location.url().startsWith('/auth/')) {
                $rootScope.next_url = $location.url();
            }
        })
    }

})();
