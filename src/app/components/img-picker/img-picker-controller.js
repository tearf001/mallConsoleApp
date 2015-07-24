(function () {
  "use strict";
  /**
   * Created by Administrator on 2015/7/23.
   */
  angular
    .module('mallConsoleApp')
    .controller('imgPickerModalInsCtrl', function ($log, $scope, Upload, utils, $modalInstance, inData) {
      $scope.imgPickerCtx = {
        inData: inData,
        files: [],
        fileOrder: [],
        outData: "",
        upload: utils.uploadProductPicFunc(Upload, $scope)
      };

      $scope.$watch('imgPickerCtx.files', function () {
        //$log.info('$scope.imgPickerCtx.files',$scope.imgPickerCtx.files);
        if (!$scope.imgPickerCtx.files) return;
        $scope.imgPickerCtx.fileOrder.length = 0;
        for (var i = 0; i < $scope.imgPickerCtx.files.length; i++) {
          var a = $scope.imgPickerCtx.files[i].name;
          $scope.imgPickerCtx.fileOrder.push({id: i, title: a})
        }
        //$log.warn('$scope.imgPickerCtx.files',$scope.imgPickerCtx.files);
      });
      $scope.ok = function () {
        $modalInstance.close($scope.data);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    })
    .filter('sortByPseudoListTreeId', function ($log) {
      return function (arrayStuff, scope) {
        if(!(arrayStuff instanceof Array)) return arrayStuff;
        return arrayStuff.sort(function (a, b) {
          var ar = scope.imgPickerCtx.fileOrder;
          return _.findIndex(ar, {'title': a.name}) - _.findIndex(ar, {'title': b.name});
        });
      };
    })
})();
