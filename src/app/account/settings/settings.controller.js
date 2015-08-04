(function () {
  "use strict";
  angular.module('mallConsoleApp').controller('SettingsCtrl',
    ['$scope', '$state', 'authService', '$window',
      function ($scope, $state, authService,$window) {
        $scope.authentication = authService.authentication;
        if (!$scope.authentication.isAuth) {
          $state.go('login');//.path('/login');// console.log(authService.authentication)
        }
        $scope.errors = {};

        $scope.changePassword = function (form) {
          $scope.submitted = true;
          if (form.$valid) {
            $window.console.log(authService);
            authService.changePassword(authService.authentication.userName, $scope.user.oldPassword, $scope.user.newPassword)
              .then(function () {
                $scope.message = '密码已经修改！';
                $window.alert($scope.message);
                $state.go('home');
              })
              .catch(function (ex) {
                form.password.$setValidity('mongoose', false);
                $scope.errors.other = '错误的密码！';
                $scope.message = '';
                $window.console.log(ex);
              });
          }
        };
      }]);
})();
