(function () {
  'use strict';
  angular.module('mallConsoleApp')
    .config(
    ['$stateProvider', '$urlRouterProvider',
      function ($stateProvider) { //$urlRouterProvider
        $stateProvider
          .state('products', {  //根
            url: '/products',
            abstract: true,     //抽象状态-其状态不可直接激活,而由其子状态激活,那么其视图模板中的ui-view即为子状态视图填充
            templateUrl: 'app/products/products.html',
            resolve: {
              Categories: function (productsService) {
                return productsService.getCategories();
              }
            },
            controller: ['$scope', '$state', '$http', '$timeout', 'Upload', 'Categories',
              function ($scope, $state, $http, $timeout, Upload, Categories) {
                $scope.Categories = Categories;
              }]
          })
          .state('products.overview', {
            url: '',
            templateUrl: 'app/products/products.overview.html'
          })
          .state('products.template', { //特定类型下列表
            url: '/tmpl/{tmplId:[0-9]+}',
            resolve:{
              //每次进入前重新加载
              tmplProducts: function (utils,productsService,$stateParams) {
                //console.log('riririri',productsService.getProductsByCategoryId($stateParams.tmplId));
                return productsService.getProductsByCategoryId($stateParams.tmplId);
              }
            },
            views: {
              '': {
                templateUrl: function ($stateParams) {
                  return 'app/products/tmpl' + $stateParams.tmplId + '.html';
                },
                controller:'ProductsOfCategoryController'
                //controllerProvider: function ($stateParams) {
                //  return 'ProductsOfCategoryController';//+ $stateParams.tmplId ,如果需要多个控制器,那么引入注释部分
                //}
              }
            }
          })
          .state('products.template.single', { //单个商品详情
            url: '/{prodId:[0-9]+}',
            templateUrl: 'app/products/products.single.html',                         //tmplProducts 由父状态继承
            resolve:{
              productInfo: function (productsService,$stateParams) {
                return productsService.getInfo($stateParams.prodId).then(function (data) {
                  //console.log('!!!!',data);
                  return data;
                });
              }
            },
            controller:'SingleProductManageController'
          });
      }
    ]
  );

})();
