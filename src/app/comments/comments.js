/**
 * Created by Administrator on 2015/7/1.
 */
(function(){
    'use strict';
  angular.module('mallConsoleApp').config(
    ['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
        $stateProvider
          .state('comments', {
            url: '/comments',
            templateUrl: 'app/comments/comments.html',
            resolve: {
              comments: ['commentsService',
                function (s) {
                  return s.all();
                }]
            },
            controller: ['$scope', '$state', '$http', '$timeout', 'comments',
              function ($scope, $state, $http,$timeout, comments) {
                $scope.comments = comments;
                $scope.newItem = {};
                $scope.states = {
                  newForm: false,
                  isAdding: false
                };
                $scope.selectComment= function (comment) {
                  $scope.selectedComment = comment;
                };
                $scope.showForm = function (sf) {
                  $scope.states.newForm = sf;
                };
                $scope.addComment = function (comment) {
                  $scope.states.isAdding = true;
                  //$http.post(prod).then...
                  $timeout(  //模拟HTTP请求
                    function () {
                      $scope.comments.push(comment);
                    }, 500)
                    //动态效果消失
                    .finally(function () {
                      $scope.states.isAdding = false;
                      $scope.newItem = {};
                    });
                };
              }]
          });
      }
    ]
  );
})();
