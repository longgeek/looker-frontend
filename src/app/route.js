(function() {
    'use strict';

    angular
        .module('appLooker')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        // do not need login require
        function skipIfLoggedIn($q, $auth, $location) {
            var deferred = $q.defer();
            if ($auth.isAuthenticated()) {
                if ($location.url().indexOf('/auth/login') !== -1 || $location.url().indexOf('/auth/signup') !== -1) {
                    $location.url('/learn');
                } else { deferred.reject(); }
            } else { deferred.resolve(); }
            return deferred.promise;
        }

        // must need login status require
        function loginRequired($q, $location, $auth, $state) {
            var deferred = $q.defer();
            if ($auth.isAuthenticated()) { deferred.resolve(); }
            else { $location.path('/auth/login'); }
            return deferred.promise;
        }

        var description = "未来图谱(Fuvism)，一款全新打造的，基于云计算和大数据技术构建，采用沉浸式编程学习模式和任务通关激励机制，面向就业的工程师培养规划，专注于编程学习的平台。";
        $urlRouterProvider.otherwise("/learn");
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "app/views/home/home.html",
                data: { pageTitle: '专注于沉浸式编程学习', specialClass: 'landing-page landing-home-page home', pageDescription: description },
            })
            .state('home.404', {
                url: "404",
                templateUrl: "app/views/404.html",
                data: { pageTitle: '页面没有找到', specialClass: 'landing-page', pageDescription: "404 错误，这个页面不存在，请检查 URL 地址是否正确。" },
            })
            .state('home.overview', {
                url: "overview",
                templateUrl : "app/views/overview/overview.html",
                data: { pageTitle: '学习总览', specialClass: 'landing-page', pageDescription: description},
                controller: OverviewController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.moments', {
                url: "moments",
                templateUrl : "app/views/moments/moments.html",
                data: { pageTitle: '广场', specialClass: 'landing-page moments-page', pageDescription: description},
                controller: MomentsController,
            })
            .state('home.moments.friend', {
                url: "/friend",
                data: { pageTitle: '好友圈', specialClass: 'landing-page moments-page', pageDescription: description },
            })
            .state('home.moments.my', {
                url: "/my",
                data: { pageTitle: '我的发布', specialClass: 'landing-page moments-page', pageDescription: description },
            })
            .state('home.moments.detail', {
                url: "/detail/:ud",
                templateUrl : "app/views/moments/detail.html",
                data: { specialClass: 'landing-page moments-page' },
                controller: MomentsDetailController,
            })
            .state('home.consumption', {
                url: "consumption",
                templateUrl : "app/views/consumption/consumption.html",
                data: { pageTitle: '消费记录', specialClass: 'landing-page', pageDescription: description },
                controller: ConsumptionController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.profile', {
                url: "profile",
                templateUrl : "app/views/profile/profile.html",
                data: { pageTitle: '个人信息', specialClass: 'landing-page', pageDescription: description },
                controller: ProfileController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.profile.intro', {
                url: "/intro",
                templateUrl : "app/views/profile/intro.html",
                data: { pageTitle: '个人简介', specialClass: 'landing-page', pageDescription: description },
                controller: ProfileIntroController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.profile.tags', {
                url: "/tags",
                templateUrl : "app/views/profile/tags.html",
                data: { pageTitle: '个人标签', specialClass: 'landing-page', pageDescription: description },
                controller: ProfileTagsController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.profile.password', {
                url: "/password",
                templateUrl : "app/views/profile/password.html",
                data: { pageTitle: '修改密码', specialClass: 'landing-page', pageDescription: description },
                controller: ProfilePasswordController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.profile.email', {
                url: "/email",
                templateUrl : "app/views/profile/email.html",
                data: { pageTitle: '变更邮箱', specialClass: 'landing-page', pageDescription: description },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.profile.email.confirm', {
                url: "/confirm/?identity",
                data: { pageTitle: '确认邮箱', specialClass: 'landing-page', pageDescription: description },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.profile.email.complete', {
                url: "/complete/?identity",
                data: { pageTitle: '完成变更', specialClass: 'landing-page', pageDescription: description },
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.profile.nickname', {
                url: "/nickname",
                templateUrl : "app/views/profile/nickname.html",
                data: { pageTitle: '修改别名', specialClass: 'landing-page', pageDescription: description },
                controller: ProfileNicknameController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.profile.operate', {
                url: "/operate",
                templateUrl : "app/views/profile/operate.html",
                data: { pageTitle: '操作日志', specialClass: 'landing-page', pageDescription: description },
                controller: ProfileOperateController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.profile.login', {
                url: "/login",
                templateUrl : "app/views/profile/login.html",
                data: { pageTitle: '登录日志', specialClass: 'landing-page', pageDescription: description },
                controller: ProfileLoginController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.profile.buylearning', {
                url: "/buylearning",
                templateUrl : "app/views/profile/buylearnings.html",
                data: { pageTitle: '已购买的', specialClass: 'landing-page', pageDescription: description },
                controller: ProfileBuylearningController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.account', {
                url: "account",
                templateUrl : "app/views/account/account.html",
                data: { pageTitle: '账户', specialClass: 'landing-page', pageDescription: description },
                controller: AccountController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.account.recharge', {
                url: "/recharge",
                templateUrl : "app/views/account/recharge.html",
                data: { pageTitle: '账户充值', specialClass: 'landing-page', pageDescription: description },
                controller: AccountController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.pay', {
                url: "account/pay/?order_id",
                templateUrl : "app/views/account/pay.html",
                data: { pageTitle: '微信支付', specialClass: 'landing-page', pageDescription: description },
                controller: PayController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.success', {
                url: "account/recharge/success",
                templateUrl : "app/views/account/recharge-success.html",
                data: { pageTitle: '充值成功', specialClass: 'landing-page', pageDescription: description },
                controller: RechargeSuccessController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.account.history', {
                url: "/history",
                templateUrl : "app/views/account/history.html",
                data: { pageTitle: '充值记录', specialClass: 'landing-page', pageDescription: description },
                controller: AccountHistoryController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.account.coupon', {
                url: "/coupon",
                templateUrl : "app/views/account/coupon.html",
                data: { pageTitle: 'Recharge Coupon', specialClass: 'landing-page', pageDescription: description },
                controller: AccountCouponController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.account.lnvoice', {
                url: "/lnvoice",
                templateUrl : "app/views/account/lnvoice.html",
                data: { pageTitle: 'Recharge Lnvoice', specialClass: 'landing-page', pageDescription: description },
                controller: AccountLnvoiceController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.invite', {
                url: "invite",
                templateUrl : "app/views/invite/invite.html",
                data: { pageTitle: '邀请好友', specialClass: 'landing-page', pageDescription: description },
                controller: InviteController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            // .state('home.labs', {
            //     url: "labs",
            //     templateUrl : "app/views/labs/labs.html",
            //     data: { pageTitle: '实验室', specialClass: 'landing-page labs-page', pageDescription: description},
            //     controller: LabsController,
            // })
            // .state('home.labs.detail', {
            //     url: "/detail/:ud",
            //     templateUrl : "app/views/labs/detail.html",
            //     data: { pageTitle: '实验详情', specialClass: 'landing-page labs-page' },
            //     controller: LabsDetailController,
            // })
            // .state('home.labs.my', {
            //     url: "/my",
            //     templateUrl : "app/views/labs/my.html",
            //     data: { pageTitle: '我的实验', specialClass: 'landing-page labs-page' },
            //     controller: LabsMyController,
            // })
            // .state('labs_workspace', {
            //     url: "/labs/workspace/:ud",
            //     templateUrl : "app/views/labs/workspace/workspace.html",
            //     data: { pageTitle: '实验室控制台', specialClass: 'labs-ws_pages study-page' },
            //     controller: LabsWorkspaceController,
            // })

            .state('home.exercises', {
                url: "exercises",
                templateUrl: "app/views/exercises/exercises.html",
                data: { pageTitle: '练习题库', specialClass: 'landing-page labs-page', pageDescription: description},
                controller: ExercisesController,
            })
            .state('home.exercises.my', {
                url: "/my",
                templateUrl : "app/views/exercises/my.html",
                data: { pageTitle: '我的练习', specialClass: 'landing-page labs-page' },
                controller: ExercisesMyController,
            })
            .state('exercises_workspace', {
                url: "/exercises/workspace/:ud",
                templateUrl : "app/views/exercises/workspace/workspace.html",
                data: { pageTitle: '练习题库控制台', specialClass: 'workspace_page study-page' },
                controller: ExercisesWorkspaceController,
            })
            .state('learn', {
                url: "/learn",
                templateUrl: "app/views/learn/learn.html",
                data: { pageTitle: '丰富的课程类型', specialClass: 'landing-page learn', pageDescription: "Fuvism 完整的学习规划，通过在线课程，项目实战，阶段测评，实验室，练习题库，构建了一整套完整的课程体系，借助于工单问答系统，实现从真正零基础到开发工程师的学习体验。" },
                controller: LearnController,
                resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                name: 'wu.masonry',
                            }
                        ]);
                    }
                }
            })
            .state('learn.plan', {
                url: "/plan",
                templateUrl: "app/views/learn/plan/list.html",
                data: { pageTitle: '职业规划', specialClass: 'landing-page learn-plan', pageDescription: "职业计划面向就业需求的技能学习，包含了软件工程师，系统工程师，前端工程师，网络工程师等不同职业范畴，由浅到深，零基础起步，可就业为止。" },
                controller: PlanListController,
            })
            .state('learn.course', {
                url: "/course",
                templateUrl: "app/views/learn/course/list.html",
                data: { pageTitle: '在线课程', specialClass: 'landing-page learn-course', pageDescription: '在线课程帮助你学习新技能，包含了入门，进修等不同级别的课程，如果你需要更完整的学习计划，请参看 "职业计划" 课程。' },
                controller: CourseListController,
            })
            .state('learn.project', {
                url: "/project",
                templateUrl: "app/views/learn/project/list.html",
                data: { pageTitle: '项目实战', specialClass: 'landing-page learn-project', pageDescription: "项目实战提供真实的项目开发指导，包含了项目的介绍，分析，技术说明，环境创建，编码，测试，部署等完整过程，是在你完成必要的技术学习后，实践你的技能。" },
                controller: ProjectListController,
            })
            // .state('learn.lab', {
            //     url: "/lab",
            //     templateUrl: "app/views/learn/lab/list.html",
            //     data: { pageTitle: '实验室', specialClass: 'landing-page learn-course', pageDescription: "实验室提供一种环境，帮助你去深究一些知识，通过必要的指导，启发，在一种实验的环境下研究一个知识点。" },
            //     controller: LabListController,
            // })
            .state('learn.quiz', {
                url: "/quiz",
                templateUrl: "app/views/learn/quiz/list.html",
                data: { pageTitle: '阶段测评', specialClass: 'landing-page learn-course', pageDescription: "测评能评价你对某个技能的掌握情况，通过不同级别的在线的测验，评价你的技能掌握情况。 " },
                controller: QuizListController,
            })
            .state('learn.exercise', {
                url: "/exercise",
                templateUrl: "app/views/learn/exercise/list.html",
                data: { pageTitle: '练习题库', specialClass: 'landing-page learn-course', pageDescription: '在完成必要的课程学习后，或者课外时间，做练习你能帮助你强化知识和技能，练习题也会被作为课程的 "课后作业"。' },
                controller: ExerciseListController,
            })
            .state('learn.plan.detail', {
                parent: 'learn',
                url: "/plan/detail/?ud",
                templateUrl: "app/views/learn/plan/detail.html",
                data: { pageTitle: '职业规划详情', specialClass: 'landing-page learn-plan-detail learn-plan', pageDescription: description },
                controller: PlanDetailController,
            })
            .state('learn.course.detail', {
                parent: 'learn',
                url: "/course/detail/?pd&&ud",
                templateUrl: "app/views/learn/course/detail.html",
                data: { pageTitle: '在线课程详情', specialClass: 'landing-page learn-course-detail learn-course', pageDescription: description },
                controller: CourseDetailController,
            })
            .state('learn.project.detail', {
                parent: 'learn',
                url: "/project/detail/?pd&&ud",
                templateUrl: "app/views/learn/project/detail.html",
                data: { pageTitle: '项目实战详情', specialClass: 'landing-page learn-course-detail learn-project', pageDescription: description },
                controller: ProjectDetailController,
            })
            // .state('learn.lab.detail', {
            //     parent: 'learn',
            //     url: "/lab/detail/?pd&&ud",
            //     templateUrl: "app/views/learn/lab/detail.html",
            //     data: { pageTitle: '实验室详情', specialClass: 'landing-page learn-course-detail learn-detail', pageDescription: description },
            //     controller: LabDetailController,
            // })
            .state('learn.quiz.detail', {
                parent: 'learn',
                url: "/quiz/detail/?pd&&ud",
                templateUrl: "app/views/learn/quiz/detail.html",
                data: { pageTitle: '阶段测评详情', specialClass: 'landing-page learn-course-detail learn-detail', pageDescription: description },
                controller: QuizDetailController,
            })
            .state('learn.exercise.detail', {
                parent: 'learn',
                url: "/exercise/detail/?pd&&ud",
                templateUrl: "app/views/learn/exercise/detail.html",
                data: { pageTitle: '练习题库详情', specialClass: 'landing-page learn-course-detail learn-detail', pageDescription: description },
                controller: ExerciseDetailController,
            })
            .state('study', {
                url: "/learn/study",
                templateUrl: "app/views/learn/study/study.html",
                data: { pageTitle: '学习控制台', specialClass: 'study-page', pageDescription: "Fuvism 的学习环境，仿真了真实的工作(开发)环境而构建。使得每一次学习，都和工作环境拥有一样的开发界面，一样的执行过程，一样的输出展示，在学习中尽早适应工作需要。" },
                controller: StudyController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.team', {
                url: "team",
                templateUrl: "app/views/team/team.html",
                data: { pageTitle: '学习小组', specialClass: 'landing-page', pageDescription: "学习小组是由平台注册商家（个体，机构，企业）创建、发布，被邀请的学员可以在这里看到具体详情。"  },
                controller: TeamController,
            })
            .state('home.team.detail', {
                url: "/detail/?ud",
                templateUrl: "app/views/team/detail.html",
                data: { pageTitle: '学习小组', specialClass: 'landing-page', pageDescription: "学习小组是由平台注册商家（个体，机构，企业）创建、发布，被邀请的学员可以在这里看到具体详情。"  },
                controller: TeamDetailController,
            })
            .state('home.tickets', {
                url: "tickets/:ud",
                templateUrl: "app/views/tickets/tickets.html",
                data: { pageTitle: '工单系统', specialClass: 'landing-page', pageDescription: "Fuvism 工单系统，实现一问一答。所有问题都将通过工单系统分配给专业相符的一线工程师，做到有问必答，有答必专的高端学习支持！"  },
                controller: TicketsController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('home.qas', {
                url: "qas?pos",
                templateUrl: "app/views/qas/qas.html",
                data: { pageTitle: '所有问答', specialClass: 'landing-page', pageDescription: "Fuvism 问答系统，实现一问一答。所有问题都将通过工单系统分配给专业相符的一线工程师，做到有问必答，有答必专的高端学习支持！" },
                controller: QasController,
            })
            .state('home.qas.my', {
                parent: "home",
                url: "qas/my?pos",
                templateUrl: "app/views/qas/qas.html",
                data: { pageTitle: '我的问答', specialClass: 'landing-page', pageDescription: "Fuvism 问答系统，实现一问一答。所有问题都将通过工单系统分配给专业相符的一线工程师，做到有问必答，有答必专的高端学习支持！" },
                controller: QasController,
            })
            .state('home.qas.detail', {
                parent: "home",
                url: "qas/detail/:ud",
                templateUrl: "app/views/qas/detail.html",
                data: { pageTitle: '', specialClass: 'landing-page', pageDescription: "Fuvism 问答系统，实现一问一答。所有问题都将通过工单系统分配给专业相符的一线工程师，做到有问必答，有答必专的高端学习支持！" },
                controller: QasDetailController,
            })
            .state('u', {
                abstract: true,
                url: "/u",
                templateUrl: "app/views/content.html",
            })
            .state('u.homepage', {
                url: "/:username",
                templateUrl : "app/views/user/homepage.html",
                data: { pageTitle: '总览', specialClass: 'landing-page', pageDescription: "个人主页" },
                controller: UserHomePageController,
            })
            .state('u.homepage.activity', {
                url: "/activity",
                data: { pageTitle: '动态', specialClass: 'landing-page', pageDescription: "个人主页" },
            })
            .state('u.homepage.following', {
                url: "/following?pos",
                data: { pageTitle: '关注', specialClass: 'landing-page', pageDescription: "个人主页" },
            })
            .state('u.homepage.followers', {
                url: "/followers?pos",
                data: { pageTitle: '粉丝', specialClass: 'landing-page', pageDescription: "个人主页" },
            })
            .state('auth', {
                abstract: true,
                url: "/auth",
                templateUrl: "app/views/content.html",
            })
            .state('auth.login', {
                url: "/login",
                templateUrl: "app/views/auth/login.html",
                data: { pageTitle: '登录', specialClass: 'landing-page login-page', pageDescription: description },
                params: {next: null},
                controller: LoginController,
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn,
                }
            })
            .state('auth.signup', {
                url: "/signup/?code",
                templateUrl: "app/views/auth/signup.html",
                data: { pageTitle: '注册', specialClass: 'landing-page signup-page', pageDescription: description },
                controller: SignUpEmailController,
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn,
                }
            })
            .state('auth.signup.confirm', {
                parent: 'auth',
                url: "/signup/confirm/?identity",
                templateUrl: "app/views/auth/signup-confirm.html",
                data: { pageTitle: '注册确认', specialClass: 'landing-page signup-page', pageDescription: description },
                controller: SignUpConfirmController,
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn,
                }
            })
            .state('auth.logout', {
                url: "/logout",
                template: null,
                data: { pageTitle: '注销', specialClass: 'landing-page', pageDescription: description },
                controller: LogoutController,
            })
            .state('auth.password', {
                url: "/password/reset",
                templateUrl: "app/views/auth/password-reset.html",
                data: { pageTitle: '重置密码', specialClass: 'landing-page resetpass-page', pageDescription: description },
                controller: PasswordResetController,
            })
            .state('auth.password.confirm', {
                parent: 'auth',
                url: "/password/confirm/?identity",
                templateUrl: "app/views/auth/password-reset-confirm.html",
                data: { pageTitle: '确认重置密码', specialClass: 'landing-page signup-page', pageDescription: description },
                controller: PasswordResetConfirmController,
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn,
                }
            })
            .state('help', {
                url: "/help",
                templateUrl: "app/views/help/help.html",
                data: { pageTitle: '帮助中心', specialClass: 'landing-page', pageDescription: description },
            })
            .state('help.use', {
                url: "/use",
                templateUrl: "app/views/help/use/use.html",
                data: { pageTitle: '用户指导', specialClass: 'landing-page', pageDescription: description },
            })
            .state('help.use.start', {
                url: "/start",
                templateUrl: "app/views/help/use/start/start.html",
                data: { pageTitle: '新手上路', specialClass: 'landing-page', pageDescription: description },
            })
            .state('help.use.start.articles', {
                url: "/articles/:articles_name",
                templateUrl: "app/views/help/use/start/articles/articles.html",
                data: { pageTitle: '新手上路', specialClass: 'landing-page', pageDescription: description },
                controller: function($scope, $stateParams) {
                    $scope.articles_template = 'app/views/help/use/start/articles/' + $stateParams.articles_name + '.html';
                    $scope.highlightCode = function() {
                        $('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });
                    }
                }
            })
            .state('help.use.account', {
                url: "/account",
                templateUrl: "app/views/help/use/account/account.html",
                data: { pageTitle: '账户与充值', specialClass: 'landing-page', pageDescription: description },
            })
            .state('help.use.account.articles', {
                url: "/articles/:articles_name",
                templateUrl: "app/views/help/use/account/articles/articles.html",
                data: { pageTitle: '账户与充值', specialClass: 'landing-page', pageDescription: description },
                controller: function($scope, $stateParams) {
                    $scope.articles_template = 'app/views/help/use/account/articles/' + $stateParams.articles_name + '.html';
                    $scope.highlightCode = function() {
                        $('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });
                    }
                }
            })
            .state('help.use.how-to', {
                url: "/how-to",
                templateUrl: "app/views/help/use/how-to/how-to.html",
                data: { pageTitle: '如何选课', specialClass: 'landing-page', pageDescription: description },
            })
            .state('help.use.how-to.articles', {
                url: "/articles/:articles_name",
                templateUrl: "app/views/help/use/how-to/articles/articles.html",
                data: { pageTitle: '如何选课', specialClass: 'landing-page', pageDescription: description },
                controller: function($scope, $stateParams) {
                    $scope.articles_template = 'app/views/help/use/how-to/articles/' + $stateParams.articles_name + '.html';
                    $scope.highlightCode = function() {
                        $('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });
                    }
                }
            })
            .state('help.use.course', {
                url: "/course",
                templateUrl: "app/views/help/use/course/course.html",
                data: { pageTitle: '课程中心', specialClass: 'landing-page', pageDescription: description },
            })
            .state('help.use.course.articles', {
                url: "/articles/:articles_name",
                templateUrl: "app/views/help/use/course/articles/articles.html",
                data: { pageTitle: '课程中心', specialClass: 'landing-page', pageDescription: description },
                controller: function($scope, $stateParams) {
                    $scope.articles_template = 'app/views/help/use/course/articles/' + $stateParams.articles_name + '.html';
                    $scope.highlightCode = function() {
                        $('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });
                    }
                }
            })
            .state('help.faq', {
                url: "/faq",
                templateUrl: "app/views/help/faq/faq.html",
                data: { pageTitle: '常见问题', specialClass: 'landing-page', pageDescription: description },
            })
            .state('help.faq.account', {
                url: "/account",
                templateUrl: "app/views/help/faq/account/account.html",
                data: { pageTitle: '账户与充值', specialClass: 'landing-page', pageDescription: description },
            })
            .state('help.faq.account.articles', {
                url: "/articles/:articles_name",
                templateUrl: "app/views/help/faq/account/articles/articles.html",
                data: { pageTitle: '账户与充值', specialClass: 'landing-page', pageDescription: description },
                controller: function($scope, $stateParams) {
                    $scope.articles_template = 'app/views/help/faq/account/articles/' + $stateParams.articles_name + '.html';
                    $scope.highlightCode = function() {
                        $('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });
                    }
                }
            })
            .state('help.faq.learning', {
                url: "/learning",
                templateUrl: "app/views/help/faq/learning/learning.html",
                data: { pageTitle: '课程，学习控制台，问答', specialClass: 'landing-page', pageDescription: description },
            })
            .state('help.faq.learning.articles', {
                url: "/articles/:articles_name",
                templateUrl: "app/views/help/faq/learning/articles/articles.html",
                data: { pageTitle: '课程，学习控制台，问答', specialClass: 'landing-page', pageDescription: description },
                controller: function($scope, $stateParams) {
                    $scope.articles_template = 'app/views/help/faq/learning/articles/' + $stateParams.articles_name + '.html';
                    $scope.highlightCode = function() {
                        $('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });
                    }
                }
            })
            .state('help.faq.billing', {
                url: "/billing",
                templateUrl: "app/views/help/faq/billing/billing.html",
                data: { pageTitle: '消费,充值,邀请好友', specialClass: 'landing-page', pageDescription: description },
            })
            .state('help.faq.billing.articles', {
                url: "/articles/:articles_name",
                templateUrl: "app/views/help/faq/billing/articles/articles.html",
                data: { pageTitle: '消费,充值,邀请好友', specialClass: 'landing-page', pageDescription: description },
                controller: function($scope, $stateParams) {
                    $scope.articles_template = 'app/views/help/faq/billing/articles/' + $stateParams.articles_name + '.html';
                    $scope.highlightCode = function() {
                        $('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });
                    }
                }
            })
            .state('help.faq.ticket', {
                url: "/ticket",
                templateUrl: "app/views/help/faq/ticket/ticket.html",
                data: { pageTitle: '工单，咨询，提意见，报 Bug', specialClass: 'landing-page', pageDescription: description },
            })
            .state('help.faq.ticket.articles', {
                url: "/articles/:articles_name",
                templateUrl: "app/views/help/faq/ticket/articles/articles.html",
                data: { pageTitle: '工单，咨询，提意见，报 Bug', specialClass: 'landing-page', pageDescription: description },
                controller: function($scope, $stateParams) {
                    $scope.articles_template = 'app/views/help/faq/ticket/articles/' + $stateParams.articles_name + '.html';
                    $scope.highlightCode = function() {
                        $('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });
                    }
                }
            })
            .state('help.faq.other', {
                url: "/other",
                templateUrl: "app/views/help/faq/other/other.html",
                data: { pageTitle: '其他', specialClass: 'landing-page', pageDescription: description },
            })
            .state('help.faq.other.articles', {
                url: "/articles/:articles_name",
                templateUrl: "app/views/help/faq/other/articles/articles.html",
                data: { pageTitle: '其他', specialClass: 'landing-page', pageDescription: description },
                controller: function($scope, $stateParams) {
                    $scope.articles_template = 'app/views/help/faq/other/articles/' + $stateParams.articles_name + '.html';
                    $scope.highlightCode = function() {
                        $('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });
                    }
                }
            })
            .state('notifications', {
                abstract: true,
                url: "/notifications",
                templateUrl: "app/views/content.html",
            })
            .state('notifications.all', {
                url: "/all?ud",
                templateUrl: "app/views/notifications/notifications.html",
                data: { pageTitle: '消息中心', specialClass: 'landing-page', pageDescription: description },
                controller: NotificationsController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('notifications.moment', {
                url: "/moment?ud",
                templateUrl: "app/views/notifications/notifications.html",
                data: { pageTitle: '消息中心', specialClass: 'landing-page', pageDescription: description },
                controller: NotificationsController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('notifications.team', {
                url: "/team?ud",
                templateUrl: "app/views/notifications/notifications.html",
                data: { pageTitle: '消息中心', specialClass: 'landing-page', pageDescription: description },
                controller: NotificationsController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('notifications.qa', {
                url: "/qa?ud",
                templateUrl: "app/views/notifications/notifications.html",
                data: { pageTitle: '消息中心', specialClass: 'landing-page', pageDescription: description },
                controller: NotificationsController,
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('notifications.ticket', {
                url: "/ticket?ud",
                templateUrl: "app/views/notifications/notifications.html",
                data: { pageTitle: '消息中心', specialClass: 'landing-page', pageDescription: description },
                controller: NotificationsController,
                resolve: {
                    loginRequired: loginRequired
                }
            })

            .state('about', {
                url: "/about",
                templateUrl: "app/views/about/about.html",
                data: { pageTitle: '关于 Fuvism', specialClass: 'landing-page', pageDescription: description },
                controller: AboutController,
            })
        }
})();
