(function () {
  'use strict';

  angular.module('mallConsoleApp')
    .controller('SignupCtrl', ['$scope', '$location', '$timeout', 'authService', function ($scope, $location, $timeout, authService) {

      $scope.savedSuccessfully = false;
      $scope.message = "";

      $scope.registration = {
        userName: "",
        password: "",
        deptId :"",
        confirmPassword: ""
      };

      $scope.signUp = function () {

        authService.saveRegistration($scope.registration).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "注册成功！页面将会在2秒内跳转至登录页"+response;
            startTimer();

          },
          function (response) {
            var errors = [];
            for (var key in response.data.modelState) {
              for (var i = 0; i < response.data.modelState[key].length; i++) {
                errors.push(response.data.modelState[key][i]);
              }
            }
            $scope.message = "Failed to register user due to:" + errors.join(' ');
          });
      };

      var startTimer = function () {
        var timer = $timeout(function () {
          $timeout.cancel(timer);
          $location.path('/login');
        }, 2000);
      };

    }]);
})();
