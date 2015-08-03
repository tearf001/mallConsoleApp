/**
 * Created by Administrator on 2015/7/23.
 */
(function () {
  "use strict";
  angular
    .module('mallConsoleApp')
    .controller('imgPickerModalInsCtrl', function ($log, $scope, $sce, Upload, utils, environment, $modalInstance, inData) {
      $scope.tabs = [
        {heading: '图片选择', template: 'tab-select.html', active: true},
        {heading: '图片上传', template: 'tab-upload.html'}];
      $scope.imgPickerCtx = {
        inData: inData,
        files: [],
        outData: "",
        //图片上传服务封装在utils中,todo 重新划分模块:?,命名为上传服务?
        upload: function (files) {
          if (files.length) {
            utils.uploadProductPicFunc(Upload, $scope, {/*authData*/})//本处转入锚点$scope,由第三方模块服务Upload处理上传.
            (files);
            if ($scope.uploadResult && $scope.uploadResult.length)//并入服务端
            {
              $scope.servedImages = $scope.uploadResult.concat($scope.servedImages);
              $scope.uploadResult.length = 0;
            }
          }
        }
      };
      $scope.servedImages = _.map(["<img src='assets/images/karma.png' style='width:200px'/>"], function (item) {
        return {eurl: item, rurl: item};
      });
      $scope.makeUp = function (success, data) {
        if (success) {
          $scope.uploadResult = data;
          //todo 转换成url图片标签
        } else {
          $scope.uploadResult = _.map(data, function (item) {
            var html = "<img src='assets/images/" + item.name + "' style='width:100px'/>";//测试多文本时用
            return {eurl: $sce.trustAsHtml(html), rurl: html};
          });
        }
        //$scope.servedImages = $scope.uploadResult.concat($scope.servedImages);
        $scope.imgPickerCtx.files.length = 0;
        $scope.tabs[0].active = true;
      };
      $scope.insertSelected = function () {
        var r = [];
        if ($scope.uploadResult && $scope.uploadResult.length) {
          angular.forEach($scope.uploadResult, function (file) {
            if (file.selected) {
              r.push(file.rurl);
            }
          });
        }
        if ($scope.servedImages && $scope.servedImages.length) {
          angular.forEach($scope.servedImages, function (file) {
            if (file.selected) {
              r.push(file.rurl);
            }
          });
        }
        $modalInstance.close(r);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    });
  ////通过外部元素排序,hack方式.deprecated,保留注释为了参考filter用法,_.findIndex的用法
  //.filter('sortByPseudoListTreeId', function ($log) {
  //  return function (arrayStuff, scope) {
  //    if(!(arrayStuff instanceof Array)) return arrayStuff;
  //    return arrayStuff.sort(function (a, b) {
  //      var ar = scope.imgPickerCtx.fileOrder;
  //      return _.findIndex(ar, {'title': a.name}) - _.findIndex(ar, {'title': b.name});
  //    });
  //  };
  //})
})();
