/**
 * Created by wongxinhai on 15/8/2.
 */
(function(){
  'use strict';
  angular.module('mallConsoleApp')
    .directive('singleImgUpload', ['utils',function (utils) {
      return {
        restrict:'EA',
        scope:{
          src:'='
        },
        template:'<div>\n  <div class="btn-group">\n    <button ngf-select\n            class="btn btn-info"\n            ngf-accept="\'image/*\'"\n            ng-model="files"\n            ngf-keep-distinct="true"\n            ngf-keep="true">\n      <h6>更换</h6>\n    </button>\n    <button class="btn btn-warning" ng-show="files.length" ng-click="upload()"><h6>上传</h6></button>\n    <button class="btn btn-danger" ng-show="files.length" ng-click="files.length=0"><h6>取消</h6></button>\n  </div>\n\n  <div class="row" ng-show="files.length">\n    <img ngf-src="files[0]" ngf-accept="\'image/*\'" style="width:100%;padding: 15px">\n  </div>\n  <div class="row" ng-hide="files.length">\n    <img ng-src="{{src}}" alt="原图片"/>\n  </div>\n  \n  <!--进度条-->\n  <progressbar value="progressPercentage"\n               ng-if="rogressPercentage>=0 && progressPercentage<1">\n        <span style="color:black; white-space:nowrap;">\n        {{progressPercentage}}</span>\n  </progressbar>\n</div>',
        controller: function ($scope,Upload) {
          $scope.test ="I am from Directive singleImgUpload!";
          $scope.makeUp= function (suc,data) {
            //todo singleImgUpload 上传成功回调
            //files
            //alert('上传回调!'+angular.toJson(data));
            if(!suc){
              $scope.src="assets/images/"+data[0].name;
            }else{
              //todo 找到返回数据的url
              //$scope.src=data[0].url;
            }
          };
          $scope.$on('$destroy', function () {
            //alert('销毁!');
            delete $scope.files;
          });
          $scope.upload = function () {
            if ($scope.files && $scope.files.length) {
              utils.uploadProductPicFunc(Upload, $scope, {/*authData*/})//本处转入锚点$scope,由第三方模块服务Upload处理上传.
              ($scope.files);
              //todo 上传成功回调,在makeUp之后执行
              //if ($scope.uploadResult && $scope.uploadResult.length)//并入服务端
              //{
              //  $scope.src=$scope.uploadResult.url;
              //}
            }
          };
        }
      };
    }]);
})();
