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
            resolve:{
              //每次进入前重新加载
              tmplProducts: function (utils,productsService,$stateParams) {
                return productsService.getProductsByType($stateParams.tmplId).then(function (data) {
                    //alert(JSON.stringify(data));
                    return data;
                  }, function (err) {
                    return err;
                });
              }
            },
            views: {
              '': {
                templateUrl: function ($stateParams) {
                  return 'app/products/tmpl' + $stateParams.tmplId + '.html';
                },
                controllerProvider: function ($stateParams) {
                  return 'productsType'  + "Controller";//+ $stateParams.tmplId ,如果需要多个控制器,那么引入注释部分
                }}
            }
          })
          .state('products.template.single', { //单个商品
            url: '/{prodId:[0-9]+}',
            templateUrl: 'app/products/products.single.html',                         //tmplProducts 由父状态继承
            controller: ['$scope', '$stateParams', '$state', 'utils','$log','$history','tmplProducts',
              function (  $scope,   $stateParams,   $state,  utils,$log, $history,tmplProducts) {
                $scope.singleProduct = utils.findById(tmplProducts,$stateParams.prodId);
                $log.debug('--singleProduct@products.single--',$scope.singleProduct,'--tmplProducts@detect--',tmplProducts);

                $scope.$stateParams = $stateParams;
                $scope.back = function () {
                  $history.back();
                };
                $scope.edit = function () {
                  $state.go('.edit',$stateParams);
                };
              }]
          })
          .state('products.template.single.edit', { //单个商品编辑
            views: {
              // This is targeting the unnamed view within the 'contacts.detail' state
              // essentially swapping out the template that 'contacts.detail.item' had
              // inserted with this state's template.
              '@products': {
                templateUrl: 'app/products/products.single.edit.html',
                controller: ['$scope', '$stateParams', '$state',
                  function ($scope, $stateParams, $state) {
                    $scope.done = function () {
                      console.log('--singleProduct@products.single.edit--$stateParams:',$stateParams);
                      // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.
                      $state.go('^.^',$stateParams);
                    };
                    $scope.tinymceOptions = {
                      onChange: function(e) {
                        // put logic here for keypress and cut/paste changes
                      },
                      inline: false,
                      plugins : 'advlist autolink link image lists charmap preview',
                      skin: 'lightgray',
                      theme : 'modern',
                      lang:'zh_CN'
                    };
                  }]
              }
            }
          });
      }
    ]
  )
    .controller('productsCommonCtrl', ['$scope', '$state', '$http', '$timeout', 'Upload', 'productTypes', 'productsService',
      function ($scope, $state, $http, $timeout, Upload, productTypes, productsService) {
        productsService.getProductsByType('').then(function (data) { //每次进入都重新加载
          $scope.products = data;
        });
        $scope.types = productTypes;
      }])
    //tmplProducts ,加载时 resolve获得
    .controller('productsTypeController', ['$scope', '$state','$stateParams', '$http', '$timeout', 'Upload', 'tmplProducts',
      function ($scope, $state,$stateParams, $http, $timeout, Upload, tmplProducts) {
        console.log('--tmplProducts@productsTypeController:',tmplProducts);
        var self = $scope;//this;
        self.products = tmplProducts;
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
