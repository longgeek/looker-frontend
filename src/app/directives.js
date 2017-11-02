/**
 * INSPINIA - Responsive Admin Theme
 *
 * Main directives.js file
 * Define directives for used plugin
 *
 *
 * Functions (directives)
 *  - sideNavigation
 *  - iboxTools
 *  - minimalizaSidebar
 *  - vectorMap
 *  - sparkline
 *  - icheck
 *  - ionRangeSlider
 *  - dropZone
 *  - responsiveVideo
 *  - chatSlimScroll
 *  - customValid
 *  - fullScroll
 *  - closeOffCanvas
 *  - clockPicker
 *  - landingScrollspy
 *  - fitHeight
 *  - iboxToolsFullScreen
 *  - slimScroll
 *
 */


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                var title = 'Fuvism';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'Fuvism | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();

            });
        }
    };
};

/**
 * responsibleVideo - Directive for responsive video
 */
function responsiveVideo() {
    return {
        restrict: 'A',
        link:  function(scope, element) {
            var figure = element;
            var video = element.children();
            video
                .attr('data-aspectRatio', video.height() / video.width())
                .removeAttr('height')
                .removeAttr('width')

            //We can use $watch on $window.innerWidth also.
            $(window).resize(function() {
                var newWidth = figure.width();
                video
                    .width(newWidth)
                    .height(newWidth * video.attr('data-aspectRatio'));
            }).resize();
        }
    }
}

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
        }
    };
}

/**
 * iboxTools with full screen - Directive for iBox tools elements in right corner of ibox with full screen option
 */
function iboxToolsFullScreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools_full_screen.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            };
            // Function for full screen
            $scope.fullscreen = function () {
                var ibox = $element.closest('div.ibox');
                var button = $element.find('i.fa-expand');
                $('body').toggleClass('fullscreen-ibox-mode');
                button.toggleClass('fa-expand').toggleClass('fa-compress');
                ibox.toggleClass('fullscreen');
                setTimeout(function() {
                    $(window).trigger('resize');
                }, 100);
            }
        }
    };
}

/**
 * minimalizaSidebar - Directive for minimalize sidebar
*/
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 100);
                } else if ($('body').hasClass('fixed-sidebar')){
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 300);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};


function closeOffCanvas() {
    return {
        restrict: 'A',
        template: '<a class="close-canvas-menu" ng-click="closeOffCanvas()"><i class="fa fa-times"></i></a>',
        controller: function ($scope, $element) {
            $scope.closeOffCanvas = function () {
                $("body").toggleClass("mini-navbar");
            }
        }
    };
}

/**
 * vectorMap - Directive for Vector map plugin
 */
function vectorMap() {
    return {
        restrict: 'A',
        scope: {
            myMapData: '=',
        },
        link: function (scope, element, attrs) {
            element.vectorMap({
                map: 'world_mill_en',
                backgroundColor: "transparent",
                regionStyle: {
                    initial: {
                        fill: '#e4e4e4',
                        "fill-opacity": 0.9,
                        stroke: 'none',
                        "stroke-width": 0,
                        "stroke-opacity": 0
                    }
                },
                series: {
                    regions: [
                        {
                            values: scope.myMapData,
                            scale: ["#1ab394", "#22d6b1"],
                            normalizeFunction: 'polynomial'
                        }
                    ]
                },
            });
        }
    }
}


/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
    return {
        restrict: 'A',
        scope: {
            sparkData: '=',
            sparkOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.sparkData, function () {
                render();
            });
            scope.$watch(scope.sparkOptions, function(){
                render();
            });
            var render = function () {
                $(element).sparkline(scope.sparkData, scope.sparkOptions);
            };
        }
    }
};

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, $attrs, ngModel) {
            return $timeout(function() {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function(newValue){
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
            });
        }
    };
}

/**
 * ionRangeSlider - Directive for Ion Range Slider
 */
function ionRangeSlider() {
    return {
        restrict: 'A',
        scope: {
            rangeOptions: '='
        },
        link: function (scope, elem, attrs) {
            elem.ionRangeSlider(scope.rangeOptions);
        }
    }
}

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
function dropZone() {
    return function(scope, element, attrs) {
        element.dropzone({
            url: "/upload",
            maxFilesize: 100,
            paramName: "uploadfile",
            maxThumbnailFilesize: 5,
            init: function() {
                scope.files.push({file: 'added'});
                this.on('success', function(file, json) {
                });
                this.on('addedfile', function(file) {
                    scope.$apply(function(){
                        alert(file);
                        scope.files.push({file: 'added'});
                    });
                });
                this.on('drop', function(file) {
                    alert('file');
                });
            }
        });
    }
}

/**
 * chatSlimScroll - Directive for slim scroll for small chat
 */
function chatSlimScroll($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '234px',
                    railOpacity: 0.4
                });

            });
        }
    };
}

/**
 * customValid - Directive for custom validation example
 */
function customValid(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
            scope.$watch(attrs.ngModel, function() {

                // You can call a $http method here
                // Or create custom validation

                var validText = "Inspinia";

                if(scope.extras == validText) {
                    c.$setValidity('cvalid', true);
                } else {
                    c.$setValidity('cvalid', false);
                }

            });
        }
    }
}


/**
 * fullScroll - Directive for slimScroll with 100%
 */
function fullScroll($timeout){
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '100%',
                    railOpacity: 0.9
                });

            });
        }
    };
}

/**
 * slimScroll - Directive for slimScroll with custom height
 */
function slimScroll($timeout){
    return {
        restrict: 'A',
        scope: {
            boxHeight: '@'
        },
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: scope.boxHeight,
                    railOpacity: 0.9
                });

            });
        }
    };
}

/**
 * clockPicker - Directive for clock picker plugin
 */
function clockPicker() {
    return {
        restrict: 'A',
        link: function(scope, element) {
                element.clockpicker();
        }
    };
};


/**
 * landingScrollspy - Directive for scrollspy in landing page
 */
function landingScrollspy(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.scrollspy({
                target: '.navbar-fixed-top',
                offset: 80
            });
        }
    }
}

/**
 * fitHeight - Directive for set height fit to window height
 */
function fitHeight(){
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.css("height", $(window).height() + "px");
            element.css("min-height", $(window).height() + "px");
        }
    };
}

/**
 * checkListHeight - Directive for set height fit to study check list height
 */
function checkListHeight(){
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.css("height", $(window).height() - 59 + "px");
            element.css("min-height", $(window).height() - 59 + "px");
        }
    };
}


/**
 * scrollToSticky - Directive the listen left-study-box the scroll event,
 *                  sticky the title.
 */
function scrollToSticky($window) {
    return function(scope, element, attrs) {
        element.bind('scroll', function() {
            if (element.find("#study-docs").length !== 0 && element.find("#study-task").length !== 0) {
                position = element.find("#study-task").offset().top - 50;
                if (position > 40) {
                    element.find("#study-task .ibox-title").removeClass('study-fixed-task');
                    element.find("#study-task .study-check-list").css("padding-top", "0");
                } else {
                    element.find("#study-task .ibox-title").addClass('study-fixed-task');
                    element.find("#study-task .study-check-list").css("padding-top", "40px");
                }
            }
        })
    }
}


/**
 * checkRequiredIframe
 */
function checkRequiredIframe() {
    return {
        scope: {
            callBack: '&checkRequiredIframe'
        },
        link: function(scope, element, attrs) {
            element.on('load', function() {
                return scope.callBack();
            })
        }
    }
}


/**
 * backTop
 */
function backTop() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 50) { element.addClass('show'); }
                else { element.removeClass('show'); }
            });
        }
    }
}


/**
 * studyEvent - in the study container to listen event
 */
function studyEvent() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.on("keypress click mousedown", function(event) {
                scope.idle_refresh(event);
            })
        }
    }
}

/**
 * scrollableTabsetFontSize
 * Angular-ui-tab-scroll plugin to solve the problem after setting up the font-size: 12px does not show
 */
function scrollableTabsetFontSize($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function() {
                element.css("font-size", "12px");
            })
        }
    };
};


/**
 * modalDialog
 */
function modalDialog() {
  return {
    restrict: 'AC',
    link: function($scope, element) {
        var draggableStr = "draggableModal";
        var header = $(".modal-header", element);

        header.on('mousedown', function (mouseDownEvent) {
          var modalDialog = element;
          var offset = header.offset();

          modalDialog.addClass(draggableStr).parents().on('mousemove', function (mouseMoveEvent) {
                $("." + draggableStr, modalDialog.parents()).offset({
                    top: mouseMoveEvent.pageY - (mouseDownEvent.pageY - offset.top),
                    left: mouseMoveEvent.pageX - (mouseDownEvent.pageX - offset.left)
                });
            }).on('mouseup', function () {
                 modalDialog.removeClass(draggableStr);
            });
        });
     }
  }
}

/**
 * markdownImagePreview - Directive for markdown the image to click preview
 */
function markdownImagePreview() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function (event) {
                if (event.target.nodeName === 'IMG') {
                    scope.imagePreview('查看图片', event.target.src);
                }
            });
        }
    }
}
/**
 * textareaImage - Directive for footable the ng-repeat done
 */
function textareaImage($http, $timeout, GLOBAL_VAR) {
    return function($scope, element, attrs) {
        if (attrs.textareaImage === "qa") {
            if ($scope.qa) {
                element.inlineattachment({
                    uploadUrl: GLOBAL_VAR.qiniu.upload_file + "?bucket=" + $scope.qa.studyqa_bucket_name + "&&domain=" + $scope.qa.studyqa_bucket_domain,
                    jsonFieldName: "url",
                    progressText: "![上传图片中...]()",
                    errorText: "Error uploading file",
                    urlText: "![image]({filename})",
                    onFileReceived: function(file) {
                        $timeout(function() { $scope.reply.uploading = true; }, 0)
                    },
                    onFileUploaded: function(response) {
                        $timeout(function() {
                            $scope.reply.content = element.val();
                            $scope.reply.uploading = false;
                        }, 0)
                    },
                    onFileUploadError: function(response) {
                        if (response.status === 612) {
                            $scope.qaUploadError = "图片大小超出 4M 限制, 请尝试使用拖放方式重新上传."
                        } else {
                            $scope.qaUploadError = response.response;
                        }
                    },
                });
                element.markdownToolbar();
            }
        }
        else if (attrs.textareaImage === "moments") {
            if ($scope.moments) {
                element.inlineattachment({
                    uploadUrl: GLOBAL_VAR.qiniu.upload_file + "?bucket=" + $scope.moments.moment_bucket_name + "&&domain=" + $scope.moments.moment_bucket_domain,
                    jsonFieldName: "url",
                    progressText: "![上传图片中...]()",
                    errorText: "Error uploading file",
                    urlText: "![image]({filename})",
                    onFileReceived: function(file) {
                        $timeout(function() { $scope.publish_content.uploading = true; }, 0)
                    },
                    onFileUploaded: function(response) {
                        $timeout(function() {
                            $scope.publish_content.content = element.val();
                            $scope.publish_content.uploading = false;
                        }, 0)
                    },
                    onFileUploadError: function(response) {
                        if (response.status === 612) {
                            $scope.momentUploadError = "图片大小超出 4M 限制, 请尝试使用拖放方式重新上传."
                        } else {
                            $scope.momentUploadError = response.response;
                        }
                    },
                });
                element.markdownToolbar();
            }
        }
    }
}


/**
 * userHomePageScroll - 在个人页面滚动时候，固定副标题
 */
function userHomePageScroll($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind('scroll', function() {
            position = angular.element("body").scrollTop();
            // 固定用户首页副标题
            if (position >= 60) {
                angular.element(".section-user-homepage-header").addClass("fixed");
                angular.element(".section-user-homepage-content ").css("padding-top", "100px");
            } else {
                angular.element(".section-user-homepage-header").removeClass("fixed");
                angular.element(".section-user-homepage-content ").css("padding-top", "40px");
            }
            // 固定用户主页个人头像和名字
            if (position >= 220) {
                angular.element(".section-user-homepage-header .left nav").hide();
                angular.element(".section-user-homepage-header .sticky-bar").addClass("fixed");
            } else {
                angular.element(".section-user-homepage-header .sticky-bar").removeClass("fixed");
                angular.element(".section-user-homepage-header .left nav").show();
            }
        })
    }
}


/**
 * momentsPageScroll - 在圈子页面滚动时候，固定副标题
 */
function momentsPageScroll($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind('scroll', function() {
            position = angular.element("body").scrollTop();
            // 固定用户首页副标题
            if (position >= 60) {
                angular.element(".section-moments-header").addClass("fixed");
                angular.element(".section-moments-content ").css("padding-top", "100px");
            } else {
                angular.element(".section-moments-header").removeClass("fixed");
                angular.element(".section-moments-content").css("padding-top", "40px");
            }
        })
    }
}


/**
 * momentsActionCollapse - 圈子系统通知，点击详情按钮展开
 */
function momentsActionCollapse($timeout) {
    return function (scope, element) {
        element.bind("click", function() {
            expand = element.find(".expand");
            reduce = element.find(".reduce");
            hide_content = element.parent().parent().find(".hide-content");
            if (expand.css("display") === "inline") {
                expand.css("display", "none");
                reduce.css("display", "inline");
            } else {
                expand.css("display", "inline");
                reduce.css("display", "none");
            }
            hide_content.slideToggle(200);
        })
    }
}


/**
 * qasPageScroll - 在问答页面滚动时候，固定副标题
 */
function qasPageScroll($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind('scroll', function() {
            position = angular.element("body").scrollTop();
            // 固定用户首页副标题
            if (position >= 60) {
                angular.element(".section-qas-header").addClass("fixed");
                angular.element(".section-qas-content ").css("padding-top", "100px");
            } else {
                angular.element(".section-qas-header").removeClass("fixed");
                angular.element(".section-qas-content").css("padding-top", "40px");
            }
        })
    }
}


angular
    .module('appLooker')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('vectorMap', vectorMap)
    .directive('sparkline', sparkline)
    .directive('icheck', icheck)
    .directive('ionRangeSlider', ionRangeSlider)
    .directive('dropZone', dropZone)
    .directive('responsiveVideo', responsiveVideo)
    .directive('chatSlimScroll', chatSlimScroll)
    .directive('customValid', customValid)
    .directive('fullScroll', fullScroll)
    .directive('closeOffCanvas', closeOffCanvas)
    .directive('clockPicker', clockPicker)
    .directive('landingScrollspy', landingScrollspy)
    .directive('fitHeight', fitHeight)
    .directive('checkListHeight', checkListHeight)
    .directive('iboxToolsFullScreen', iboxToolsFullScreen)
    .directive('slimScroll', slimScroll)
    .directive('scrollToSticky', scrollToSticky)
    .directive('checkRequiredIframe', checkRequiredIframe)
    .directive('backTop', backTop)
    .directive('studyEvent', studyEvent)
    .directive('scrollableTabsetFontSize', scrollableTabsetFontSize)
    .directive('modalDialog', modalDialog)
    .directive('markdownImagePreview', markdownImagePreview)
    .directive('textareaImage', textareaImage)
    .directive('userHomePageScroll', userHomePageScroll)
    .directive('momentsPageScroll', momentsPageScroll)
    .directive('momentsActionCollapse', momentsActionCollapse)
    .directive('qasPageScroll', qasPageScroll)
