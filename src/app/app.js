/**
 * Looker - Learn in cloud management system
 *
 */

(function () {
    angular.module('appLooker', [
        'ngResource',                   // angular-resource
        'ui.router',                    // Routing
        'ui.bootstrap',                 // Ui Bootstrap
        'pascalprecht.translate',       // Angular Translate
        'ipCookie',                     // angular-cookie
        'angularResizable',             // angular-resizable
        'ui.ace',                       // angular-ui-ace
        'duScroll',                     // angular-scroll
        'ngDragDrop',                   // angular-dragdrop
        'timer',                        // angular-timer
        'satellizer',                   // satellizer
        'luegg.directives',             // angular-scroll-glue
        'ui.gravatar',                  // angular-gravatar
        'smoothScroll',                 // ngSmoothScroll
        'ui.sortable',                  // angular-ui-sortable
        'slick',                        // angular-slick
        'hljs',                         // angular-highlightjs
        'hc.marked',                    // angular-marked
        'oc.lazyLoad',                  // oclazyload
        'summernote',                   // angular-summernote
        'angular-ladda',                // angular-ladda
        'angular-bind-html-compile',    // angular-bind-html-compile
        'toaster',                      // angularjs-toaster
        'ngclipboard',                  // ngclipboard
        'ui.tab.scroll',                // angular-ui-tab-scroll
        'Tek.progressBar',              // angular-tek-progress-bar
        'g1b.calendar-heatmap',         // angular-calendar-heatmap
        'chart.js',                     // angular-chart.js
        'ngQiniu',                      // ng-qiniu
        'btford.markdown',              // angular-markdown-directive
        'monospaced.elastic',           // angular-elastic
        'ngEmojiPicker',                // ng-emoji-picker
        'infinite-scroll',              // ngInfiniteScroll
        'ngTagsInput',                  // ng-tags-input
    ]);
})();

// Other libraries are loaded dynamically in the config.js file using the library ocLazyLoad
