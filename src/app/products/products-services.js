/**
 * Created by Administrator on 2015/7/1.
 */
(function () {
  'use strict';
  //静态代码演示用.项目生产环境的'服务'全部封装在Restangular
  angular.module('mallConsoleApp')
    .factory('productsService', ['$http', 'utils', 'environment', function ($http, utils, environment) {

      var heads = {header: {'Content-Type': 'application/json; charset=utf-8'}};
      //promise;

      var promiseFn = function (path) {
          return $http.get(path, heads).then(function (resp) {
          console.log('--static--',path,'---', resp.data.data);
          return resp.data.data;
        }, function (error) {
          console.log(error);
          return error;
        });
      };

      var productsPromise = promiseFn(environment.testData + '/products.json');
      var CategoriesPromise = promiseFn(environment.testData + '/productsCategory.json');
      var productsInfoPromise = promiseFn(environment.testData + '/productsInfo.json');
      var factory = {};


      factory.getProductsByCategoryId = function (id) {
        return productsPromise.then(function (data) {
          if (id===undefined) return data;
          return data.filter(function (it) {
            return it.subCategoryId == id;
          });
        })
      };
      factory.getCategories = function () {
        return CategoriesPromise.then(function (data) {
          return data;
        })
      };
      factory.get = function (id) {
        return productsPromise.then(function (data) {
          return utils.findById(data, id, 'productID');
        })
      };
      factory.getInfo = function (id) {
        return productsInfoPromise.then(function (data) {
          return utils.findById(data, id, 'productID');
        })
      };
      return factory;
    }]);

})();
