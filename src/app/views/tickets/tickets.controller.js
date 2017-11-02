/**
 * Ticket Controller
 *
 * Functions (controllers)
 *  - TicketsController
 */

/**
 * TicketsController - Ticket controller
 * use tickets.html view
 */
function TicketsController($scope, $state, $stateParams, $timeout, $uibModal, RestFul, GLOBAL_VAR) {
    // 监控该工单是否有新的回复
    $scope.$watch("notifications", function(newValue, oldValue, scope) {
        // 遍历 notifications 所有通知
        if (newValue === undefined || Object.getOwnPropertyNames(newValue).length === 0 || !newValue.hasOwnProperty('values') || !newValue.values) { return }
        for (k in newValue.values) {
            val = newValue.values[k];

            // 判断是否为回复通知、并且和该工单 UUID 一致
            if (val.ctype === "ticket:replied" && $scope.ticket && val.params.ticket.uuid === $scope.ticket.uuid) {
                // 遍历该工单的多个通知 UUID
                for (i in val.notification_uuids) {
                    exist = false;
                    ud = val.notification_uuids[i];
                    o_val = $scope.original_notifications[ud];

                    // 遍历该工单的所有回复
                    // 判断通知的回复 id 是否存在于所有回复中
                    for (j in $scope.ticket.replies) {
                        replie = $scope.ticket.replies[j];
                        if (o_val.params.reply.id === replie.id) {
                            exist = true; break;
                        }
                    }
                    if (!exist) {
                        $scope.ticket.replies.push(o_val.params.reply);
                        $timeout(function() { $scope.scrollToBottom(); }, 0)
                    }
                }
                // 消费该工单的所有回复消息
                $scope.notification_consume(k, val);
            }
            // 新工单通知在进入该工单时候，直接消费消息
            else if (val.ctype === "ticket:new" && $scope.ticket && val.params.uuid === $scope.ticket.uuid) {
                $scope.notification_consume(k, val);
            }
            // 工单已解决通知在进入该工单时候，直接消费消息
            else if (val.ctype === "ticket:resolved" && $scope.ticket && val.params.uuid === $scope.ticket.uuid) {
                $scope.notification_consume(k, val);
                $scope.ticket.is_resolved = true;
                $scope.tickets[$scope.ticketIndex].is_resolved = true;
            }
            // 工单附件消息通知，新附件和删除附件通知
            else if (val.ctype === "ticket:attached" && $scope.ticket && val.params.uuid === $scope.ticket.uuid) {
                $scope.notification_consume(k, val);
                if (val.params.add_or_del) {
                    if ($scope.ticket.attach === null) {
                        $scope.ticket.attach = {"sorted": [], "values": {}};
                    }
                    $scope.ticket.attach.sorted.push(val.params.target_name);
                    $scope.ticket.attach.values[val.params.target_name] = val.params;
                } else {
                    $scope.ticket.attach.sorted.splice($scope.ticket.attach.sorted.indexOf(val.params.target_name), 1);
                    delete $scope.ticket.attach.values[val.params.target_name];
                }
            }
            // 工单已被工程师接受，开始处理通知。
            else if (val.ctype === "ticket:accepted" && $scope.ticket && val.params.uuid === $scope.ticket.uuid) {
                $scope.notification_consume(k, val);
                $scope.ticket.is_accepted = true;
            }
        }
    }, true)

    // 在进入工单详情后，消费该工单所有的消息
    function ticket_detail_consume() {
        if ($scope.notifications === undefined || Object.getOwnPropertyNames($scope.notifications).length === 0 || !$scope.notifications.hasOwnProperty('values') || !$scope.notifications.values) { return }
        for (k in $scope.notifications.values) {
            val = $scope.notifications.values[k];
            if (val.ctype === "ticket:replied" && val.params.ticket.uuid === $scope.ticket.uuid) {
                $scope.notification_consume(k, val);
            }
            else if (val.ctype === "ticket:new" && val.params.uuid === $scope.ticket.uuid) {
                $scope.notification_consume(k, val);
            }
            else if (val.ctype === "ticket:resolved" && val.params.uuid === $scope.ticket.uuid) {
                $scope.notification_consume(k, val);
            }
            else if (val.ctype === "ticket:attached" && val.params.uuid === $scope.ticket.uuid) {
                $scope.notification_consume(k, val);
            }
        }
    }

    // 创建工单
    $scope.createTicket = function() {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/tickets/create-ticket.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: false,
            size: 'md',
            controller: 'CreateTicketController',
        });
    }

    $scope.ticket_list = function() {
        RestFul.global(
            {"action": "Ticket:MyTickets", "params": {}},
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    if (response.data) {
                        index = 0;
                        if ($stateParams.ud) {
                            for (i in response.data.tickets) {
                                if ($stateParams.ud === response.data.tickets[i].uuid) {
                                    index = i;
                                    break;
                                } else {
                                    index = 0;
                                }
                            }
                        }
                        $scope.tickets = response.data.tickets;
                        if (response.data.tickets.length) {
                            $scope.ticketDetail(response.data.tickets[index].uuid, index);
                        }
                    } else {
                        $scope.tickets = [];
                    }
                }
            }
        )
    }
    $scope.ticket_list();

    $scope.ticketDetail = function(uuid, index) {
        $stateParams.ud = uuid;
        $scope.ticketIndex = index;
        $scope.detailLoading = true;
        $state.go("home.tickets", {'ud': uuid}, {notify: false});
        RestFul.global(
            {
                "action": "Ticket:TicketDetail",
                "params": {"ticket": uuid}
            },
            function(response) {
                if (!response) { return; };
                if (response.hasOwnProperty('message')) {
                    $scope.ticket = response.data;
                    ticket_detail_consume();
                    uploader_init();
                    $timeout(function() { $scope.detailLoading = false; }, 500)
                }
            }
        )
    }

    $scope.replyMsg = {"content": ""};
    $scope.replyTicketMsg = function() {
        if ($scope.replyMsg.content) {
            if ($scope.checkSum($scope.replyMsg.content) > 4096) {
                $scope.globalTipsDialog("消息内容不能超过 4096 个字符");
                return;
            }
            $scope.replyMsg.ticket = $scope.ticket.uuid;
            RestFul.global(
                {"action": "Ticket:TicketReply", "params": $scope.replyMsg},
                function(response) {
                    if (!response) { return; };
                    if (response.hasOwnProperty('message')) {
                        $scope.ticket.replies.push(response.data);
                        $scope.replyMsg = {"content": ""};
                    }
                }
            )
        }
    }
    $scope.ticketMakeResolved = function() {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/tickets/close-ticket.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: false,
            size: 'sm',
            controller: 'CloseTicketController',
        });
    }

    // 延迟执行 qiniu sdk
    // 依赖 ticketdetail 中得 bucket 和 domain
    function uploader_init () {
        // oploaderOpts, optional
        $scope.uploaderOpts = {
            uptoken_url: GLOBAL_VAR.qiniu.get_uptoken + "?bucket=" + $scope.ticket.ticket_bucket_name,
            auto_start: true,
            domain: $scope.ticket.ticket_bucket_domain,
            multi_selection: false, // 是否允许同时选择多文件
            get_new_uptoken: true,  //设置上传文件的时候是否每次都重新获取新的token
            // 文件类型过滤
            filters: {
              mime_types : [
                {title : "Image files", extensions: "jpg,jpeg,gif,png"},
                {title : "Text files", extensions: "txt"},
              ]
            },
            init: {
                FilesAdded: function(up, files) {
                    // 文件添加进队列后,处理相关的事情
                 },
                BeforeUpload: function(up, file) {
                    // 每个文件上传前,处理相关的事情
                    angular.element('.upload-none').show();
                    angular.element('.upload').attr("class", "upload progressing");
                },
                UploadProgress: function(up, file) {
                    // 每个文件上传时,处理相关的事情
                },
                FileUploaded: function(up, file, info) {
                    // 每个文件上传成功后,处理相关的事情
                    // 其中 info 是文件上传成功后，服务端返回的json，形式如
                    // {
                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    //    "key": "gogopher.jpg"
                    //  }
                    // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                    var domain = up.getOption('domain');
                    var res = angular.fromJson(info);
                    var sourceLink = domain + res.key; // 获取上传成功后的文件的Url
                    RestFul.global(
                        {
                            "action": "Ticket:TicketAttach",
                            "params": {
                                "ticket": $scope.ticket.uuid,
                                "target_name": file.target_name.toLowerCase(),
                                "filename": file.name,
                                "filepath": "",
                                "filetype": file.type,
                            }
                        },
                        function(response) {
                            if (!response) { return; };
                            if (response.hasOwnProperty('message')) {
                                $timeout(function() {
                                    angular.element('.upload-none').hide();
                                    angular.element('.upload').attr("class", "upload");
                                    if (!$scope.ticket.attach) {
                                        $scope.ticket.attach = {"sorted": [], "values": {}}
                                    }
                                    $scope.ticket.attach.sorted.push(file.target_name.toLowerCase());
                                    $scope.ticket.attach.values[file.target_name.toLowerCase()] = {
                                        "filename": file.name,
                                        "filepath": "",
                                        "filetype": file.type,
                                    }
                                }, 300)
                            }
                        }
                    )
                },
                Error: function(up, err, errTip) {
                    //上传出错时,处理相关的事情
                    if (err.code === -600) {
                        $scope.globalTipsDialog('每个附件不能超过2M大小');
                    } else if (err.code === -601) {
                        $scope.globalTipsDialog('不支持该类型附件上传');
                    } else {
                        console.log(err);
                        $scope.globalTipsDialog(err.message);
                        angular.element('.upload-none').hide();
                        angular.element('.upload').attr("class", "upload");
                    }
                },
                UploadComplete: function() {
                    //队列文件处理完毕后,处理相关的事情
                },
                Key: function(up, file) {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效
                    var key = "";
                    // do something with key here
                    return key;
                }
            }
        };
    }
    $scope.deleteAttachFile = function(index, target_name, attach){
        $scope.deleteAttachInfo = {
            "index": index,
            "target_name": target_name,
            "filename": attach.filename,
            "filepath": attach.filepath,
            "filetype": attach.filetype,
        }
        var uibModalInstance = $uibModal.open({
            templateUrl: 'app/views/tickets/delete-attachment.html',
            scope: $scope,
            backdrop: 'false',
            keyboard: false,
            size: 'sm',
            controller: 'DeleteAttachmentTicketController',
        });
    };
}

angular
    .module('appLooker')
    .controller('TicketsController', TicketsController)
