(function () {
  "use strict";
  angular.module('mallConsoleApp').controller('SettingsCtrl', ['$scope', '$location', 'authService', function ($scope, $location, authService) {

    $scope.authentication = authService.authentication;
    if (!$scope.authentication.isAuth) $location.path('/login');// console.log(authService.authentication)
    $scope.errors = {};

    $scope.changePassword = function (form) {
      $scope.submitted = true;
      if (form.$valid) {
        console.log(authService);
        authService.changePassword(authService.authentication.userName, $scope.user.oldPassword, $scope.user.newPassword)
          .then(function () {
            $scope.message = 'Password successfully changed.';
            alert($scope.message);
            $location.path('/');
          })
          .catch(function (ex) {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
            console.log(ex);
          });
      }
    };
  }]);
})();
