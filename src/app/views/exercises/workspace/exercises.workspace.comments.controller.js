/**
 * Learn the Study qas controllers
 *
 * Functions (controllers)
 *  - ExercisesWorkspaceCommentsController
 */


/**
 * ExercisesWorkspaceCommentsController - study qa
 * used in study-qa.html view
 */
function ExercisesWorkspaceCommentsController($scope, $timeout, $uibModal, RestFul) {

    // jQuery ui resizable config
    resizableOption = {
        'aspectRation': false,
        'autoHide': false,
        'handles': 'n, e, s, w',
        'containment': '.exercises-ws',
        'minWidth': 300,
        'minHeight': 300,
    };
    jQuery.ui.resizable(resizableOption, $(".study-qa-container"));

    $scope.$watch('stage', function(newValue, oldValue) {
        if (newValue !== oldValue && $scope.classify === 'stage') {
            $scope.study_qas_list();
        }
    }, true)


    $scope.qa = {
        "accepted_at": 1512788198.0,
        "accepted_by": {
            "gravatar": "d58abd04f882e23ff240c7eedd9a2dc9",
            "is_first_login": true,
            "nickname": "longgeek",
            "uuid": "5b3267b4-31ab-11e6-9db5-852272057847"
        },
        "content": "as title",
        "course": {
            "description": "Python-Memcached \u662f Python \u8fde\u63a5 Memcached \u670d\u52a1\u7684\u5e38\u7528\u63a5\u53e3\uff0c\u662f 100% Python \u5b9e\u73b0\u7684 Memcached \u670d\u52a1\u63a5\u53e3\u3002\u4e5f\u662f Django, Flask, Celery \u7b49\u5f00\u53d1\u6846\u67b6\u7684\u5e38\u7528\uff0c\u6216\u9996\u9009\u3002\u672c\u8bfe\u7a0b\u7814\u7a76\u548c\u5b9e\u64cd\u5176\u91cd\u8981\u6280\u672f\u3002",
            "name": "Python-Memcached \u5b9e\u8df5",
            "uuid": "18b90e82-4426-11e6-9db5-884109560729"
        },
        "created_at": 1512787908.0,
        "created_by": {
            "gravatar": "20aebf1de7102031209dff67522f4f20",
            "is_first_login": true,
            "nickname": "Simon Luo",
            "uuid": "5b31557c-31ab-11e6-9db5-852272050857"
        },
        "is_accepted": true,
        "is_resolved": false,
        "learn": {
            "description": "Python-Memcached \u662f Python \u8fde\u63a5 Memcached \u670d\u52a1\u7684\u5e38\u7528\u63a5\u53e3\uff0c\u662f 100% Python \u5b9e\u73b0\u7684 Memcached \u670d\u52a1\u63a5\u53e3\u3002\u4e5f\u662f Django, Flask, Celery \u7b49\u5f00\u53d1\u6846\u67b6\u7684\u5e38\u7528\uff0c\u6216\u9996\u9009\u3002\u672c\u8bfe\u7a0b\u7814\u7a76\u548c\u5b9e\u64cd\u5176\u91cd\u8981\u6280\u672f\u3002",
            "name": "Python-Memcached \u5b9e\u8df5",
            "uuid": "18b90e82-4426-11e6-9db5-884109560729"
        },
        "learn_type": "course",
        "learn_uuid": "18b90e82-4426-11e6-9db5-884109560729",
        "part": {
            "description": "\u77e5\u8bc6\u70b9\uff1a\u63a5\u53e3\u4ecb\u7ecd\uff0c\u5b89\u88c5\uff0c\u670d\u52a1\u8fde\u63a5\uff0c\u8fde\u63a5\u6c60\uff0c\u5e38\u7528\u64cd\u4f5c\uff0c\u548c\u670d\u52a1\u4fe1\u606f\u4e0e\u72b6\u6001\u83b7\u53d6\u3002",
            "hardcode": "m06t",
            "name": "Python-Memcached",
            "uuid": "2925fdca-4426-11e6-9db5-884137118210"
        },
        "replies": [
            {
                "content": "\u4f60\u597d\uff0c\u542c\u4f60\u8fd9\u4e48\u4e00\u8bf4\uff0c\u6211\u90fd\u4e0d\u77e5\u9053\u8be5\u600e\u4e48\u56de\u7b54\u8fd9\u4e2a\u95ee\u9898\u4e86\uff0c\u770b\u6765\u53ea\u80fd\u9ed8\u9ed8\u7ed9\u4f60\u70b9\u8d5e\u4e86\u3002",
                "created_at": 1512788064.0,
                "created_by": {
                    "gravatar": "d58abd04f882e23ff240c7eedd9a2dc9",
                    "is_first_login": true,
                    "nickname": "longgeek",
                    "uuid": "5b3267b4-31ab-11e6-9db5-852272057847"
                },
                "id": 212,
                "is_teacher": true,
                "ticket_studyqa_uuid": "f4683c04-dcce-11e7-92cf-816707993638"
            },
            {
                "content": "?",
                "created_at": 1512788112.0,
                "created_by": {
                    "gravatar": "20aebf1de7102031209dff67522f4f20",
                    "is_first_login": true,
                    "nickname": "Simon Luo",
                    "uuid": "5b31557c-31ab-11e6-9db5-852272050857"
                },
                "id": 213,
                "is_teacher": false,
                "ticket_studyqa_uuid": "f4683c04-dcce-11e7-92cf-816707993638"
            },
            {
                "content": "\u54c8\u54c8",
                "created_at": 1512788116.0,
                "created_by": {
                    "gravatar": "20aebf1de7102031209dff67522f4f20",
                    "is_first_login": true,
                    "nickname": "Simon Luo",
                    "uuid": "5b31557c-31ab-11e6-9db5-852272050857"
                },
                "id": 214,
                "is_teacher": false,
                "ticket_studyqa_uuid": "f4683c04-dcce-11e7-92cf-816707993638"
            },
            {
                "content": "\u4f60\u597d\uff0c\u8fd8\u6709\u5176\u4ed6\u5f97\u95ee\u9898\u5417\uff1f",
                "created_at": 1512788130.0,
                "created_by": {
                    "gravatar": "d58abd04f882e23ff240c7eedd9a2dc9",
                    "is_first_login": true,
                    "nickname": "longgeek",
                    "uuid": "5b3267b4-31ab-11e6-9db5-852272057847"
                },
                "id": 215,
                "is_teacher": true,
                "ticket_studyqa_uuid": "f4683c04-dcce-11e7-92cf-816707993638"
            },
            {
                "content": "\u6ca1\u6709\u4e86\uff01\u8c22\u8c22\u3002",
                "created_at": 1512788151.0,
                "created_by": {
                    "gravatar": "20aebf1de7102031209dff67522f4f20",
                    "is_first_login": true,
                    "nickname": "Simon Luo",
                    "uuid": "5b31557c-31ab-11e6-9db5-852272050857"
                },
                "id": 216,
                "is_teacher": false,
                "ticket_studyqa_uuid": "f4683c04-dcce-11e7-92cf-816707993638"
            },
            {
                "content": "\u4e0d\u5ba2\u6c14\u3002",
                "created_at": 1512788185.0,
                "created_by": {
                    "gravatar": "d58abd04f882e23ff240c7eedd9a2dc9",
                    "is_first_login": true,
                    "nickname": "longgeek",
                    "uuid": "5b3267b4-31ab-11e6-9db5-852272057847"
                },
                "id": 217,
                "is_teacher": true,
                "ticket_studyqa_uuid": "f4683c04-dcce-11e7-92cf-816707993638"
            }
        ],
        "resolved_at": 1512788198.0,
        "resolved_by": "teacher",
        "stage": {
            "description": "Python \u5305 python-memcached \u662f 100% Python \u5b9e\u73b0\u7684 Memcached \u670d\u52a1\u63a5\u53e3\u3002\u672c\u8282\u7814\u7a76 python-memcached \u7684\u5b89\u88c5\uff0cMemcached \u670d\u52a1\u8fde\u63a5\uff0c\u548c\u6570\u636e\u64cd\u4f5c\u3002",
            "hardcode": "hkg0",
            "keywords": null,
            "name": "Python-Memcached \u7684\u5b89\u88c5\u548c\u8fde\u63a5",
            "pass_score": 80,
            "uuid": "316a3546-3f44-11e6-9db5-347280074951"
        },
        "status": true,
        "studyqa_bucket_domain": "http://oqwspvcdo.bkt.clouddn.com/",
        "studyqa_bucket_name": "longgeek-qas",
        "task": {
            "check_required": false,
            "hardcode": "2vlo",
            "is_optional": true,
            "is_ready": true,
            "keywords": null,
            "name": "Python-Memcached \u8fde\u63a5",
            "status": true,
            "topic_support": null,
            "tringtype": "ipython",
            "uuid": "2b88b0e4-3f9e-11e6-9db5-385924914064"
        },
        "title": "Hi \u597d\u725b\u903c",
        "updated_at": 1512788198.0,
        "user_uuid": "5b31557c-31ab-11e6-9db5-852272050857",
        "uuid": "f4683c04-dcce-11e7-92cf-816707993638"
    };



}


angular
    .module('appLooker')
    .controller('ExercisesWorkspaceCommentsController', ExercisesWorkspaceCommentsController)
