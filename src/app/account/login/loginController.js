(function () {
  "use strict";
  angular.module('mallConsoleApp')
    .controller('LoginCtrl', ['$scope', '$location', 'authService', function ($scope, $location, authService) {

      $scope.loginData = {
        userName: "",
        password: "",
        useRefreshTokens: true
      };

      $scope.message = "";

      $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $location.path('/');

          },
          function (err) {
            $scope.message = err.error_description;
          });
      };

    }]);
})();
