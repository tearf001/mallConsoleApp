var app;
(function () {
  'use strict';

  extend_3rds();

  app = angular
    .module('mallConsoleApp', ['ngAnimate', 'ngTouch', 'ngSanitize',
      'restangular', 'ui.router', 'ui.bootstrap','ngStorage','ngFileUpload','ui.router.history','ui.tinymce']);
  //没有CORS
  app.constant('ngAuthSettings', {
    apiServiceBaseUri: '/', //http://10.36.111.213/DomainWiser/',
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



  function extend_3rds() {
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
