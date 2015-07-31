(function() {
  'use strict';

  angular
    .module('mallConsoleApp')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        cache: false,
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'home'
      })
      .state('login', {
        url: '/account/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/account/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/account/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
      //.state('public-set', {
      //  url: '/public-set',
      //  templateUrl: 'app/public-set/public-set.html',
      //  controller: 'publicSetController',
      //  //controllerAs: 'vm'
      //})
      //.state('orders', {
      //  url: '/orders',
      //  templateUrl: 'app/orders/orders.html',
      //  controller: 'ordersController',
      //  //controllerAs: 'vm'
      //})
      //.state('comments', {
      //  url: '/comments',
      //  templateUrl: 'app/comments/comments.html',
      //  controller: 'commentsController',
      //  //controllerAs: 'vm'
      //});

    $urlRouterProvider.otherwise('/');
  }

})();
