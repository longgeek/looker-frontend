/**
 * Exercise of exercises controllers
 *
 * Functions (controllers)
 *  - ExercisesWorkspaceController
 */


/**
 * ExercisesWorkspaceController
 */
function ExercisesWorkspaceController($scope, RestFul, $uibModal) {
    $scope.task = {
        "check_lists": [
            {
                "check_required": true,
                "content": "\u53c2\u770b\u8303\u4f8b2\uff0c\u5b8c\u6210\u5e26\u53c2\u6570\u7684\u7c7b MyAuto \u7684\u5b9a\u4e49\u90e8\u5206\u3002",
                "standard_answer": {
                    "content": "#!/usr/bin/env python\n# -*- coding: utf-8 -*-\n# Author: Fuvism Team <contact@fuvism.com>\n# Copyright (c) 2016 - FUVISM\n\n\n# coding here\nclass MyAuto:\n    var = \"Property: I am a car.\"\n\n    def __init__(self, var):\n        self.var = var\n\n    def run(self):\n        print \"'%s' running...\" % self.var",
                    "filename": "simple.py"
                },
                "uuid": "29643923-9947-93fa-a8c5-b5697b0f8c51"
            },
            {
                "check_required": true,
                "content": "\u53c2\u770b\u8303\u4f8b2\uff0c\u5b8c\u6210\u5e26\u53c2\u6570\u7684\u7c7b MyAuto \u7684\u5b9e\u4f8b\u5316\u5e94\u7528\u90e8\u5206\u3002",
                "standard_answer": {
                    "content": "#!/usr/bin/env python\n# -*- coding: utf-8 -*-\n# Author: Fuvism Team <contact@fuvism.com>\n# Copyright (c) 2016 - FUVISM\n\n\n# coding here\nclass MyAuto:\n    var = \"Property: I am a car.\"\n\n    def __init__(self, var):\n        self.var = var\n\n    def run(self):\n        print \"'%s' running...\" % self.var\n\n\nif __name__ == \"__main__\":\n    var = 'QQ'\n    myQQ = MyAuto(var)\n    print myQQ.var\n    myQQ.run()",
                    "filename": "simple.py"
                },
                "uuid": "4f453d89-d4ca-b965-46d4-8386cf5d5c47"
            }
        ],
        "check_required": false,
        "extra_data": {
            "files": {
                "simple.py": "#!/usr/bin/env python\n# -*- coding: utf-8 -*-\n# Author: Fuvism Team <contact@fuvism.com>\n# Copyright (c) 2016 - FUVISM\n\n\n# coding here\nclass MyAuto:\n    var = \"Property: I am a car.\"\n    \n    def __init__(self, var):\n        self.var = var\n        \n    def run(self):\n        print \"'%s' running...\" % self.var\n        \n        \nif __name__ == '__main__':\n    var = 'QQ'\n    myQQ = MyAuto(var)\n    print myQQ.var\n    myQQrun()"
            }
        },
        "hardcode": "x758",
        "is_optional": true,
        "is_ready": true,
        "keywords": null,
        "name": "\u5b9a\u4e49\u5e26\u65b9\u6cd5\u7684\u7c7b",
        "position": {
            "origin": "course",
            "source": {
                "current_course_uuid": "a4744bb6-36b2-11e6-9db5-405157254355",
                "current_curriculum_uuid": null,
                "current_part_uuid": "a47ceffa-36b2-11e6-9db5-405157310969",
                "current_stage_uuid": "5a78e6e8-3897-11e6-9db5-613339046958",
                "current_task_uuid": "ba40d60c-389d-11e6-9db5-616076721175"
            }
        },
        "reference_material": "\u524d\u9762\u6211\u4eec\u591a\u6b21\u5b9e\u8df5 __init__ \u65b9\u6cd5\uff0c\u53ea\u662f\u8fd9\u4e2a\u65b9\u6cd5\u662f\u5185\u7f6e\u7684\uff0c\u89c4\u5b9a\u597d\u7684\uff0c\u90a3\u4e48\u5982\u4f55\u5b9a\u4e49\u548c\u4f7f\u7528\u81ea\u5b9a\u4e49\u7684\u65b9\u6cd5\u5462\uff1f\n\n#### \u5b9a\u4e49\n\u8303\u4f8b1:\n```\nclass MyClass:\n\n    def func(self):\n        return 'OK'\n```\n\u5b9a\u4e49\u65b9\u6cd5\uff0c\u5fc5\u987b\u5305\u62ec\u5728\u7c7b\u7684\u91cc\u9762\uff0c\u5e76\u4e14\u518d\u6b21\u5f3a\u8c03\uff0c\u9996\u4e2a\u53c2\u6570\u5fc5\u987b\u662f 'self'\u3002\n\n`\u5173\u4e8e self \u7684\u795e\u5947\u4f5c\u7528\uff0c\u6211",
        "status": true,
        "topic_content": {
            "files": [
                {
                    "content": "#!/usr/bin/env python\n# -*- coding: utf-8 -*-\n# Author: Fuvism Team <contact@fuvism.com>\n# Copyright (c) 2016 - FUVISM\n\n\n# coding here\n",
                    "display": true,
                    "filename": "simple.py",
                    "g_key": "python:simple_python",
                    "is_exec": true,
                    "is_text": true
                }
            ]
        },
        "topic_support": "python",
        "tringtype": "coding",
        "uuid": "ba40d60c-389d-11e6-9db5-616076721175"
    },







    $scope.showComments = function() {
        $scope.showExercisesComment = !$scope.showExercisesComment;
    }

    $scope.toStudyDocs = function() {
        container = angular.element('#study-left-nav__container');
        study_docs = angular.element('#study-docs-container');
        container.scrollTo(study_docs, 0, 200);
    }
    $scope.toStudyTask = function() {
        container = angular.element('#study-left-nav__container');
        study_task = angular.element('#study-task-container');
        container.scrollTo(study_task, 0, 300);
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
    .controller('ExercisesWorkspaceController', ExercisesWorkspaceController)
