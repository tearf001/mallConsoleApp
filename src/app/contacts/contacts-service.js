angular.module('mallConsoleApp')
    .factory('contactsService', ['$http', 'utils', function ($http, utils) {
        var path = 'assets/test-data/contacts.json';
        var contacts = $http.get(path).then(function (resp) {
            return resp.data.data;
        });

        var factory = {};
        factory.all = function () {
            return contacts;
        };
        factory.get = function (id) {
            return contacts.then(function () {
                return utils.findById(contacts, id);
            })
        };
        return factory;
    }]);
