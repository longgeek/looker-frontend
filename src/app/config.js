(function() {
    'use strict';

    angular
        .module('appLooker')
        .config(pluginConfig);

    /** @ngInject */
    function pluginConfig($stateProvider, $uiViewScrollProvider, $authProvider, $locationProvider, gravatarServiceProvider, hljsServiceProvider, $ocLazyLoadProvider, laddaProvider, ChartJsProvider) {
        jQuery.ajaxSetup({cache: true});
        $uiViewScrollProvider.useAnchorScroll();
        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: false
        });

        // Remove angular js the url '#'
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        // Use Gravatar images
        gravatarServiceProvider.secure = true;
        gravatarServiceProvider.defaults = {
            size: 100,
            "default": "identicon",
            "rating": "pg",
        };
        // Override URL generating function
        // gravatarServiceProvider.urlFunc = function(options) {
        //     // // Use duoshuo url
        //     // options.src = 'http://gravatar.duoshuo.com/avatar/' + options.src;
        //     // return options.src + '?' + 'default=' + options.params.default + '&size=' + options.params.size;
        // };

        // Ladda button the global options
        laddaProvider.setOption({
            style: 'slide-left',
            spinnerSize: 20,
        });

        // Highlight JS Configuration
        hljsServiceProvider.setOptions({
            // replace tab with 4 spaces
            tabReplace: '    '
        });

        // Configure angular markdown
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight: function (code) {
                return hljs.highlightAuto(code).value;
            }
        })

        // Auth Options
        $authProvider.httpInterceptor = true;
        $authProvider.withCredentials = true;
        $authProvider.tokenRoot = null;
        $authProvider.cordova = false;
        $authProvider.baseUrl = '';
        $authProvider.loginUrl = '/api/v1';
        $authProvider.signupUrl = '/auth/signup';
        $authProvider.unlinkUrl = '/auth/unlink/';
        $authProvider.tokenName = 'access_token';
        $authProvider.tokenPrefix = '';
        $authProvider.authHeader = 'X-Auth-Token';
        $authProvider.authToken = 'Bearer';
        $authProvider.storageType = 'localStorage';

        // Configure all charts
        ChartJsProvider.setOptions({
            chartColors: ['#1abc9c'],
            responsive: true,
        });
        // Configure all line charts
        ChartJsProvider.setOptions('line', {
            showLines: true,
        });
    }
})();
