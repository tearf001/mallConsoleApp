/**
 * Created by Administrator on 2015/7/1.
 */
angular.module('mallConsoleApp')
    .factory('productsService', ['$http', 'utils', function ($http, utils) {
        var path = 'assets/test-data/products.json';
        var heads= {header : {'Content-Type' : 'application/json; charset=utf-8'}};
        //promise;
        var productsPromise = $http.get(path,heads).then(function (resp) {
            console.log(resp.data.data);
            return resp.data.data;
        }, function (error) {
            console.log(error);
            return error;
        });

        var factory = {};
        factory.all = function () {
            return productsPromise;
        };
        factory.getProductsByType = function (type) {
          return this.all().then(function (data) {
            if(!type) return data;
            return data.filter(function (it) {
                return it.type==type;
            });
          })
        };
        factory.get = function (id) {
            return productsPromise.then(function () {
                return utils.findById(productsPromise, id,'productId');
            })
        };
        return factory;
    }]);
