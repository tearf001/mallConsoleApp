/**
 * Created by wongxinhai on 15/8/2.
 */
(function () {
  'use strict';
  angular.module('mallConsoleApp')
    //加载特定目录下产品列表
    .controller('ProductsOfCategoryController',
    ['$scope', '$state', '$stateParams', '$timeout', 'tmplProducts',
      function ($scope, $state, $stateParams, $timeout, tmplProducts) {
        console.log('--tmplProducts@productsTypeController:', tmplProducts);
        $scope.products = tmplProducts;
      }])
    .controller('SingleProductManageController',
    ['$q', '$timeout', '$scope', '$stateParams', '$state', 'utils', '$log', 'toastr', '$history', '$modal', 'Upload', 'tmplProducts', 'productInfo',
      function ($q, $timeout, $scope, $stateParams, $state, utils, $log, toastr, $history, $modal, Upload, tmplProducts, productInfo) {
        //从数据库中加载,或者从客户端缓冲中加载
        var productIns = utils.findById(tmplProducts, $stateParams.prodId, 'productID');//从客户端缓冲中取数
        //$scope.singleProduct = Restangular.one('products',$stateParams.prodId).$object;//从服务端取数
        //单个商品,必须要扩展 productInfo.具体模型不知,可参考对应的设计者
        $scope.productIns = angular.copy(productIns);
        $scope.productInfo = angular.copy(productInfo);
        $log.debug('--products.single:productIns--', $scope.productIns, '--productInfo--', productInfo);
        $scope.$stateParams = $stateParams;

        $scope.prodInfoTabs = [_.extend({}, $scope.productInfo, {active__: true})];

        $scope.back = function () {
          $history.back();
        };
        $scope.$watch(
          'productIns' //function (scope) { return angular.toJson(scope.productIns);}
          , function (newValue, oldValue) {
            if ($scope.mainState==1 && newValue != oldValue) {
              $log.warn('---watch:nv+ev:', newValue, oldValue);
              $scope.mainState =2;
            }
          }, true);
        $scope.mainState = 0;
        $scope.StateDesc = {
          '0': ["编辑","glyphicon glyphicon-pencil"],//初始 ->编辑
          '1': ["","glyphicon glyphicon-console"],//激活 ->编辑中
          '2': ['保存',"glyphicon glyphicon-floppy-save"]// 数据变化->保存
        };
        $scope.mainCancel = function () {
          //delete $scope.productIns;
          $scope.mainState = 0;
          angular.extend($scope.productIns,productIns);
          //$scope.apply();
        };
        ///////开启编辑,状态维护,保存////////
        $scope.mainEdit = function () {
          if ($scope.mainState == 2) { //数据有变化
            $scope.StateDesc.mainSaving = true;
            $timeout(function () {
              $q.when(productIns).then(function (data) {
                //$scope.singleProduct.extend(data);
                $scope.mainState = 0;//更新数据
              }, function (err) {
                toastr.error(err);
              }).finally(function () {
                $scope.StateDesc.mainSaving = undefined;
              });
            }, 1000);

          }
          $scope.mainState = ($scope.mainState + 1) % 2;
        };
        $scope.upload = utils.uploadProductPicFunc(Upload, $scope);
        $scope.ckeditorOptions = utils.ckeditorConfig('default');
        $scope.pickBack = undefined;
        $scope.openImgPicker = function () { //打开情态窗口
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
            var oEditor = CKEDITOR.instances.editor1;
            _.forEach(pickBack, function (ins) {
              //tinymce.activeEditor.execCommand('mceInsertContent', false, i);
              var newElement = CKEDITOR.dom.element.createFromHtml(ins, oEditor.document);
              oEditor.insertElement(newElement);

            });

          }, function (e) {
            $log.info('Modal dismissed at: ', e);
          });
        }
      }])
})();

