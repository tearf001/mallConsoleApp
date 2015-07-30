/**
 * Created by Administrator on 2015/7/1.
 */
angular.module('mallConsoleApp')
  .factory('productsService', ['$http', 'utils', 'environment', 'Restangular', function ($http, utils, environment, Restangular) {

    var path = environment.isStatic ? environment.testData + '/products.json' : environment.apiBaseUrl;

    var heads = {header: {'Content-Type': 'application/json; charset=utf-8'}};
    //promise;

    var products = Restangular.all(environment.isStatic ?'':'products');

    //var productsPromise = $http.get(path, heads).then(function (resp) {
    //  console.log(resp.data.data);
    //  return resp.data.data;
    //}, function (error) {
    //  console.log(error);
    //  return error;
    //});

    var factory = {};
    factory.all = function () {
      return products;
    };
    factory.getProductsByType = function (type) {
      return products.all('tmpl').one(type).getList();
    }
    //factory.getProductsByType = function (type) {
    //  return this.all().then(function (data) {
    //    if (!type) return data;
    //    return data.filter(function (it) {
    //      return it.type == type;
    //    });
    //  })
    //};
    //factory.get = function (id) {
    //  return productsPromise.then(function () {
    //    return utils.findById(productsPromise, id, 'productId');
    //  })
    //};
    return factory;
  }]);
