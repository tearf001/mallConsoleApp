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
            controller: ['$scope', '$stateParams', '$state', 'utils', '$log', '$history', 'Restangular', 'tmplProducts',
              function ($scope, $stateParams, $state, utils, $log, $history, Restangular, tmplProducts) {
                //从数据库中加载,或者从客户端缓冲中加载
                $scope.singleProduct = utils.findById(tmplProducts, $stateParams.prodId);//从客户端缓冲中取数
                //$scope.singleProduct = Restangular.one('products',$stateParams.prodId).$object;//从服务端取数

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
              '@products': { //'@products' 时占用母页ui-view区域; 而 @products.template.single当前页
                templateUrl: 'app/products/products.single.edit.html',
                resolve: {
                  //每次进入前重新加载
                  singleProduct: function (utils, productsService, $stateParams) {
                    return productsService.getProductsByType($stateParams.tmplId).then(function (data) {
                      var find = _.find(data, function (e) {
                        return String(e.id) === String($stateParams.prodId);
                      });
                      return find;
                    }, function (err) {
                      return err;
                    });
                  }
                },
                controller: ['$scope', '$log', '$stateParams', '$state', 'utils', '$modal', 'singleProduct',
                  function ($scope, $log, $stateParams, $state, utils, $modal, singleProduct) {
                    $log.info(singleProduct);
                    //编辑时,需重新从数据库中加载最新数据
                    $scope.singleProduct = angular.extend(singleProduct, {_files: []});//utils.findById(tmplProducts,$stateParams.prodId);//从客户端缓冲中取数
                    $scope.done = function () {
                      console.log('--singleProduct@products.single.edit--$stateParams:',$stateParams);
                      // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.
                      $state.go('^.^',$stateParams);
                    };
                    //商品图片url序列
                    //$scope.orderImages=$scope.singleProduct.orderImages;
                    //新加的图片
                    //$scope.singleProduct.files = [];
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
                    $scope.pickBack = undefined;
                    $scope.openImgPicker = function () {
                      var modalInstance = $modal.open({
                        animation: false,
                        templateUrl: 'app/components/img-picker/img-picker.html',
                        controller: 'imgPickerModalInsCtrl',
                        size: 'lg',
                        resolve: {
                          inData: function () {
                            return "Hello";
                          }
                        }
                      });
                      modalInstance.result.then(function (pickBack) {
                        $scope.pickBack = pickBack;
                        $log.info('Modal return with: ', pickBack);
                      }, function (e) {
                        $log.info('Modal dismissed at: ', e);
                      });
                    }
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
    .controller('productsTypeController', ['$scope', '$state','$stateParams', '$http', '$timeout', 'Upload','utils', 'tmplProducts',
      function ($scope, $state,$stateParams, $http, $timeout, Upload,utils, tmplProducts) {
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
        self.upload = utils.uploadProductPicFunc(Upload,self);
        self.goExplicit = function (ps) {
          $state.go('products.template.single', ps);
        }
      }]);



})();
