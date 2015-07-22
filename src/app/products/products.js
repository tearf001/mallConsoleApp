(function () {
  'use strict';
  angular.module('mallConsoleApp')
    .constant('productTypes', [{text: '设备类', value: '1'}, {text: '附加实物', value: '2'}, {
      text: '电信增值服务-虚拟商品',
      value: '3'
    }]
  ).config(
    ['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
        $stateProvider
          .state('products', {
            url: '/products',
            abstract: true,
            templateUrl: 'app/products/products.html',
            controller: 'productsCommonCtrl'
          })
          .state('products.list', {
            url: '',
            templateUrl: 'app/products/products.list.html'
          })
          .state('products.template', { //特定类型下清单
            url: '/tmpl/{tmplId:[0-9]+}',
            views: {
              '': {
                templateUrl: function ($stateParams) {
                  var s = 'app/products/tmpl' + $stateParams.tmplId + '.html';
                  return s;
                },
                controllerProvider: function ($stateParams) {
                  var ctrlName = 'productsType' + $stateParams.tmplId + "Controller";
                  return ctrlName;
                }}
            }
          })
          .state('products.single', { //单个商品
            url: '/sgl/{prodId:[0-9]+}',
            templateUrl: 'app/products/products.single.html',
            controller: ['$scope', '$stateParams', '$state', 'utils','$log','$history',
              function (  $scope,   $stateParams,   $state,   utils,$log, $history) {
                $scope.singleProduct = utils.findById($scope.products, $stateParams.prodId);
                $log.debug('--singleProduct--',$scope.singleProduct);

                $scope.$stateParams = $stateParams;
                $scope.back = function () {
                  $history.back();
                };
                $scope.edit = function () {
                  $state.go('.edit',$stateParams);
                };
              }]
          })
          .state('products.single.edit', { //单个商品编辑
            views: {
              // This is targeting the unnamed view within the 'contacts.detail' state
              // essentially swapping out the template that 'contacts.detail.item' had
              // inserted with this state's template.
              '@products': {
                templateUrl: 'app/products/products.single.edit.html',
                controller: ['$scope', '$stateParams', '$state',
                  function ($scope, $stateParams, $state) {
                    $scope.done = function () {
                      // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.
                      $state.go('^.^.template(tmplId:'+$scope.singleProduct.id+')', $stateParams);
                    };
                  }]
              }
            }
          });
      }
    ]
  ).controller('productsCommonCtrl', ['$scope', '$state', '$http', '$timeout', 'Upload', 'productTypes', 'productsService',
      function ($scope, $state, $http, $timeout, Upload, productTypes, productsService) {
        var self = $scope;// this;
        self.products = [];
        productsService.getProductsByType('').then(function (data) {
          self.products = data;
        });
        self.newItem = {};
        self.states = {newForm: false, isAdding: false};
        self.types = productTypes;
        self.showForm = function (sf) {
          self.states.newForm = sf;
        };
        self.addProduct = function (prod) {
          self.states.isAdding = true;
          //$http.post(prod).then...
          $timeout( //模拟HTTP请求
            self.products.push(prod)
            , 100)
            //动态效果消失
            .finally(function () {
              self.states.isAdding = false;
              self.newItem = {};
            });
        };
        self.files = [];
        self.upload = uploadProductPicFunc(Upload);
      }])
    .controller('productsType1Controller', ['$scope', '$state', '$http', '$timeout', 'Upload', 'productsService',
      function ($scope, $state, $http, $timeout, Upload, productsService) {
        var self = $scope;//this;
        self.products = [];
        productsService.getProductsByType(1).then(function (data) {
          self.products = data;
        });
        self.newItem = {};
        self.states = {newForm: false, isAdding: false};
        self.showForm = function (sf) {
          self.states.newForm = sf;
        };
        self.addProduct = function (prod) {
          self.states.isAdding = true;
          //$http.post(prod).then...
          $timeout( //模拟HTTP请求
            self.products.push(prod)
            , 100)
            //动态效果消失
            .finally(function () {
              self.states.isAdding = false;
              self.newItem = {};
            });
        };
        self.files = [];
        self.upload = uploadProductPicFunc(Upload);
      }])
    .controller('productsType2Controller', ['$scope', '$state', '$http', '$timeout', 'Upload', 'productsService',
      function ($scope, $state, $http, $timeout, Upload, productsService) {
        var self = $scope;
        self.products = [];
        productsService.getProductsByType(2).then(function (data) {
          self.products = data;
        });
        self.newItem = {};
        self.states = {newForm: false, isAdding: false};
        self.showForm = function (sf) {
          self.states.newForm = sf;
        };
        self.addProduct = function (prod) {
          self.states.isAdding = true;
          //$http.post(prod).then...
          $timeout( //模拟HTTP请求
            self.products.push(prod)
            , 100)
            //动态效果消失
            .finally(function () {
              self.states.isAdding = false;
              self.newItem = {};
            });
        };
        self.files = [];
        self.upload = uploadProductPicFunc(Upload);
      }])
    .controller('productsType3Controller', ['$scope', '$state', '$http', '$timeout', 'Upload', 'productsService',
      function ($scope, $state, $http, $timeout, Upload, productsService) {
        var self = $scope;
        self.products = [];
        productsService.getProductsByType(3).then(function (data) {
          self.products = data;
        });
        self.newItem = {};
        self.states = {newForm: false, isAdding: false};
        self.showForm = function (sf) {
          self.states.newForm = sf;
        };
        self.addProduct = function (prod) {
          self.states.isAdding = true;
          //$http.post(prod).then...
          $timeout( //模拟HTTP请求
            self.products.push(prod)
            , 100)
            //动态效果消失
            .finally(function () {
              self.states.isAdding = false;
              self.newItem = {};
            });
        };
        self.files = [];
        self.upload = uploadProductPicFunc(Upload);
      }]);

  var url = "http://localhost:7245/api/fileUp";
  var token_value = 'Auud7Gv4MNiuoodyUbucRHCD2wMYYoy1Npq3JipXBd4bumEK7IsnIMEvz8qFj1jT06ovxHnBowHE6brVy2diSOYUCr7-OL_Z-ONWymj2HJmBi69JdfnVMAz1U40WnAew1FCSLy8DUkMN9rJ07qsBpGQe4j9gCzBGCeNiuF9Al5AUAFaTpvq6dfGKtWuloJPtJXXvXaRQ0-_jUeYO8VAQKsKchQjcvyol_4nWzDaBl_zcP0MCU_bb-UQOeDDBaLd9-zDOrLGiMSjxDNajZ-6cZQ';

  function uploadProductPicFunc(Upload) {
    return function uploadProductPics(files) {
      Upload.upload({
        url: url, // upload.php script, node.js route, or servlet url
        file: files,  // single file or an array of files (array is for html5 only)
        method: 'POST',//
        params: {},
        headers: {'client_id': 'ngAuthApp', 'Authorization': 'bearer ' + token_value}, // only for html5
        data: {},
        withCredentials: true,
        transformRequest: angular.identity
        //其他的angular/$http属性 and all other angular $http() options could be used here.
      }).success(function (data) {
        console.log('---uploaded ...', data);
      }).error(function (err) {
        console.log('---upload failed ...', err);
      });
    };
  }

})();
