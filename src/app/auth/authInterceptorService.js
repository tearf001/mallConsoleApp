(function(app){
  'use strict';
  app.factory('authInterceptorService',
    ['$q', '$injector','$location', '$localStorage',
      function ($q,$injector, $location, $localStorage) {

        var authInterceptorServiceFactory = {};
        //头封装  包含token
        var _request = function (config) {
          //console.log('-----**----',config);
          config.headers = config.headers || {};

          var authData = $localStorage['authorizationData'];
          if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
          }
          return config;
        }
        //异常处理
        var _responseError = function (rejection) {
          //无权访问
          if (rejection.status === 401) {
            $injector.get('authService').logOut();
            $location.path('/account/login');
          }
          return $q.reject(rejection);
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
      }]);
})(app || angular.module('mallConsoleApp') );
