/**
 * Created by Administrator on 2015/7/1.
 */
angular.module('mallConsoleApp')
    .factory('ordersService', ['$http', 'utils', function ($http, utils) {
        var path = 'assets/orders.json';
        var heads= {header : {'Content-Type' : 'application/json; charset=utf-8'}};
        //promise;
        var orders = $http.get(path,heads).then(function (resp) {
            console.log(resp.data.data);
            return resp.data.data;
        }, function (error) {
            console.log(error);
            return error;
        });

        var factory = {};
        factory.all = function () {
            return orders;
        };
        factory.get = function (id) {
            return orders.then(function () {
                return utils.findById(orders, id);
            })
        };
        return factory;
    }]);
