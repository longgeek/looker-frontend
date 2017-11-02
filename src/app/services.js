/**
 * Global Factory
 *
 * Functions (factory)
 * - GlobalVar
 *
 */

/**
 * For API global settings
 */
function GLOBAL_VAR() {
    domain = "";
    // domain = "http://127.0.0.1:8000";
    return {
        api_server: domain + '/api/v1',
        wxpay_status: domain + '/api/v1/views/pay/wxpay/status',
        qiniu: {
            delete_file: domain + '/api/v1/views/qiniu/delete',
            upload_file: domain + '/api/v1/views/qiniu/upload',
            get_uptoken: domain + '/api/v1/views/qiniu/uptoken',
        },
        fullScreenTopic: ['coding', 'ipython', 'linuxbash', 'webfront', 'webserver', 'javascript'],
    }
}


/**
 * Resource Restfull api
 * Response Interceptor and Response Error Interceptor
 * Requiest api common processing operation
 */
function RestFul($rootScope, $uibModal, $uibModalStack, $q, $auth, $state, $resource, $location, $timeout, GLOBAL_VAR, toaster) {
    // Response Warning Handle Function
    function responseWarningHandle(param_data) {
        if ($state.is('study') && param_data.data.inner_code === 501) {
            var openedModal = $uibModalStack.getTop();
            if (openedModal) { $uibModalStack.dismiss(openedModal.key); }

            var uibModalInstance = $uibModal.open({
                templateUrl: 'app/views/learn/study/study-frozen.html',
                backdrop: 'static',
                keyboard: false,
                size: 'sm',
                controller: 'StudyFrozenController',
            });
        } else {
            $rootScope.dialogTicketData = param_data;
            console.log(param_data);
            toaster.pop({
                type: 'warning',
                // title: '',
                title: param_data.config.data.action + " ================ " + angular.toJson(param_data.data),
                body: "app/views/toaster/toaster-warning.html",
                timeout: 5000,
                bodyOutputType: 'template',
                showCloseButton: true,
            });
        }
    }

    // Response Error Handle Function
    function responseErrorHandle(param_data) {
        $rootScope.dialogTicketData = param_data;
        console.log(param_data);
        if (param_data.status === -1) {
            title = "网络异常, 无法连接到服务器.";
        } else {
            title = param_data.config.data.action + " ================ " + angular.toJson(param_data.data);
        }
        toaster.pop({
            type: 'error',
            // title: '',
            title: title,
            body: "app/views/toaster/toaster-error.html",
            timeout: 5000,
            bodyOutputType: 'template',
            showCloseButton: true,
        });
    }

    // Response Interceptor
    // $q.reject(response) is reject response all datas.
    // need to the api add the "if (!response) { return; };"
    function resourceErrorHandler(response) {
        console.log('1. services.js: ' + response.config.data.action);
        responseErrorHandle(response);
        $q.reject(response);
    }

    // Response Interceptor
    function resourceResponseHandler(response) {
        // response has message key
        if (response.data.hasOwnProperty('message')) {
            return response.data;
        }
        // response has warning key
        else if (response.data.hasOwnProperty('warning')) {
            // user session lost.
            if (response.data.inner_code === 401) {
                if ($state.is("auth.login")) { return; }
                // Close the redundant session tips dialog
                var openedModal = $uibModalStack.getTop();
                if (openedModal && openedModal.value.modalDomEl.attr('class').indexOf('session-expired') !== -1) {
                    $uibModalStack.dismiss(openedModal.key);
                }
                // session tips dialog
                var uibModalInstance = $uibModal.open({
                    templateUrl: 'app/views/auth/session-expired.html',
                    scope: $rootScope,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'sm',
                    windowClass: 'session-expired',
                    controller: 'SessionExpiredController',
                });
                $q.reject(response);
            } else {
                responseWarningHandle(response);
                $q.reject(response);
            }
        }
        // response Error
        else {
            console.log('2. services.js: ' + response.config.data.action);
            responseErrorHandle(response);
            $q.reject(response);
        }
    }

    // base: No interceptor
    // response: response interceptor
    // error: response error interceptor
    // global: response and response error interceptor
    return $resource(GLOBAL_VAR.api_server, {}, {
        'base': {
            method: 'POST',
            interceptor: {}
        },
        'response': {
            method: 'POST',
            interceptor: {response: resourceResponseHandler}
        },
        'error': {
            method: 'POST',
            interceptor: {responseError: resourceErrorHandler}
        },
        'global': {
            method: 'POST',
            interceptor: {responseError: resourceErrorHandler, response: resourceResponseHandler}
        },
    });
}


/**
 * For learn the current learn position
 */
function LearnPosition() {
    return {
        learn_position: '',
    }
}

(function() {
    'use strict';

    angular
        .module('appLooker')
        .factory('GLOBAL_VAR', GLOBAL_VAR)
        .factory('RestFul', RestFul)
        .factory('LearnPosition', LearnPosition)
})();
