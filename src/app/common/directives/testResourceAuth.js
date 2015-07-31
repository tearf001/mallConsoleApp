/**
 * Created by Administrator on 2015/7/30.
 */
(function () {
  'use strict';

  angular
    .module('mallConsoleApp')
    .directive('testResourceAuth', testResourceAuth);

  /** @ngInject */
  function testResourceAuth() {

    return {
      restrict: 'E',
      template: '<div>{{testResource}}</div>',
      controller: function ($q,$rootScope, Restangular, authService) {
        //$rootScope.testResource = testResource;
        if (authService.authentication.isAuth)
          return Restangular.all('testResource').getList().then(function (data) {
            $rootScope.testResource = data;
          });
        else
          return $q.when({
            "productID": 8,
            "productName": "华为P7（P7-L090）电信4G版 白色",
            "pImagUrl": null,
            "onSaleTime": "2015-06-09T00:00:00",
            "offSaleTime": "2015-06-15T00:00:00",
            "productTypeName": "物流（快递）",
            "tCount": 100,
            "tSaleCount": 0,
            "tGoodReplyCnt": 0,
            "commentCNT": 0,
            "imgCommentCNT": 0,
            "consultcnt": 0
          }).then(function (data) {
            $rootScope.testResource = data;
          })
      }
    };
  }

})();
