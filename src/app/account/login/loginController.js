(function () {
  "use strict";
  angular.module('mallConsoleApp')
    .controller('LoginCtrl', ['$scope', '$state', 'authService', function ($scope, $state, authService) {

      $scope.loginData = {
        userName: "",
        password: "",
        useRefreshTokens: true
      };

      $scope.message = "";

      $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $state.go('home',{reload:true});

          },
          function (err) {
            $scope.message = err;
          });
      };

    }]);
})();
