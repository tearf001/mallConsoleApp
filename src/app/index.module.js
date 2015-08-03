var app;
(function () {
  'use strict';
  var environmentEnum = Object.freeze({"test": 1, "product": 2, "develop": 3,"static":4});
  //////////////////////////////////////////////////////////////////////////////////
  ///////!!!!!!非常重要,运行环境!!!!!/////////////////////////////////////////////////
  var app_environment = environmentEnum.develop;////////////////////////////////////
  ///////!!!!!!非常重要,运行环境!!!!//////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  //工作环境判定
  function environ() {
    var ctx={};
    ctx.isTest = function () {
      return app_environment === environmentEnum.test;
    };
    ctx.isProduct = function () {
      return app_environment === environmentEnum.product;
    };
    ctx.isDevelop = function () {
      return app_environment === environmentEnum.develop;
    };
    return ctx;
  }
  //运行环境参数设定
  var environContext = environ();
  environContext[environmentEnum.test] = { isTest: true,apiBaseUrl:undefined,uploadUrl:undefined };
  environContext[environmentEnum.product] = { isProduct:true,apiBaseUrl:'',uploadUrl:'' };
  environContext[environmentEnum.develop] = { isDevelop:true,apiBaseUrl:'http://localhost:7245/api', uploadUrl:'http://localhost:7245/api/fileUp' };
  environContext[environmentEnum.static] = angular.extend({},environContext[environmentEnum.develop],{ isStatic:true,testData:'assets/test-data'});

  //扩展的模块
  extended_modules_for_app();
  app = angular
    .module('mallConsoleApp', ['ngAnimate', 'ngTouch', 'ngSanitize', //官方模块
      'restangular', 'ui.router',  'ngStorage', //第三方 数据,逻辑模块
      'ui.bootstrap', 'ngFileUpload', 'ui.tree', //第三方 控件,ui工具类
      'ckeditor', //多文本编辑器 ckeditor,ng.ckeditor
      'ui.sortable',  //第三方:小模块
      'ui.router.history'  //本地模块
    ]);
  app.constant('environment',environContext[app_environment]);
  //CORS Or not
  app.constant('ngAuthSettings', {
    apiServiceBaseUri: 'http://localhost:7245/', //http://10.36.111.213/DomainWiser/',
    // apiServiceBaseUri: 'http://localhost:26264/',
    //apiServiceBaseUri: 'http://ngauthenticationapi.azurewebsites.net/',15569
    clientId: 'ngAuthApp'
  });
  //middle-ware
  app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
  });
  app.run(['authService', function (authService) {
    authService.fillAuthData();
  }]);
















  ///本地模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块
  ///自定义模块


  function extended_modules_for_app() {
    angular.module("ui.router.history", [
      "ui.router"
    ]).service("$history", function ($state, $rootScope, $window) {

      var history = [];

      angular.extend(this, {
        push: function (state, params) {
          history.push({state: state, params: params});
        },
        all: function () {
          return history;
        },
        go: function (step) {
          // TODO:
          // (1) Determine # of states in stack with URLs, attempt to
          //    shell out to $window.history when possible
          // (2) Attempt to figure out some algorthim for reversing that,
          //     so you can also go forward

          var prev = this.previous(step || -1);
          return $state.go(prev.state, prev.params);
        },
        previous: function (step) {
          return history[history.length - Math.abs(step || 1)];
        },
        back: function () {
          return this.go(-1);
        }
      });

    }).run(function ($history, $state, $rootScope) {

      $rootScope.$on("$stateChangeSuccess", function (event, to, toParams, from, fromParams) {
        if (!from.abstract) {
          $history.push(from, fromParams);
        }
      });

      $history.push($state.current, $state.params);

    });
  }

})();
