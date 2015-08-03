(function(app){
  'use strict';
  app.factory('authService',
    ['$http', '$log', '$q', '$window', '$localStorage', 'ngAuthSettings','environment',
      function ($http, $log, $q, $window, $localStorage, ngAuthSettings,environment) {
        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var authServiceFactory = {};
        var liveBefore = new Date(new Date().getTime()+ 3600*1000);
        var _authentication = {
          isAuth: false,
          userName: "",
          useRefreshTokens: false
        };

        var _saveRegistration = function (registration) {

          _logOut();

          return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
            return response;
          });

        };
        //静态,用于测试
        var _loginStatic = function (loginData) {
          var response = {access_token:'23234241-1123-23'};
          return $q.when(response).then(function () {
            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;
            _authentication.useRefreshTokens = loginData.useRefreshTokens;
            $localStorage.authorizationData = {
              token: response.access_token,
              userName: loginData.userName,
              refreshToken: "",
              useRefreshTokens: false,
              liveBefore:liveBefore
            };
          });
        };
        var _login = function (loginData) {

          var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

          if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + ngAuthSettings.clientId;
          }

          var deferred = $q.defer();
          //$log.info(data);
          $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .success(function (response) {
              if (loginData.useRefreshTokens) {
                $localStorage.authorizationData = {
                  token: response.access_token,
                  userName: loginData.userName,
                  refreshToken: response.refresh_token,
                  useRefreshTokens: true,
                  liveBefore:liveBefore
                };
              }
              else {
                $localStorage.authorizationData= {
                  token: response.access_token,
                  userName: loginData.userName,
                  refreshToken: "",
                  useRefreshTokens: false,
                  liveBefore:liveBefore

                };
              }
              _authentication.isAuth = true;
              _authentication.userName = loginData.userName;
              _authentication.useRefreshTokens = loginData.useRefreshTokens;

              deferred.resolve(response);

            }).error(function (err) {
              _logOut();
              deferred.reject(err);
            });

          return deferred.promise;

        };
        var _changePassword = function (userName, oldpass, newpass) {

          $log.info('arguments', arguments);
          var data = {
            'UserName': userName,
            'OldPassword': oldpass,
            'Password': newpass,
            'ConfirmPassword': newpass
          };
          return $http.post(serviceBase + 'api/account/ChangePassword', data).then(function (response) {
            return response;
          }, function (ex) {
            $window.alert('有错误发生!' + ex);
            $log.info('error', ex);
            return ex;
          });

        };
        var _logOut = function () {

          delete $localStorage.authorizationData;
          $log.info('you call logout!');
          _authentication.isAuth = false;
          _authentication.userName = "";
          _authentication.useRefreshTokens = false;

        };

        var _fillAuthData = function () {

          var authData = $localStorage.authorizationData;
          if (authData && authData.liveBefore>new Date()) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.useRefreshTokens = authData.useRefreshTokens;
          }

        };

        var _refreshToken = function () {
          var deferred = $q.defer();

          var authData = $localStorage.authorizationData;

          if (authData) {

            if (authData.useRefreshTokens) {

              var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

              delete $localStorage.authorizationData;

              $http.post(serviceBase + 'token', data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).success(function (response) {

                $localStorage.authorizationData = {
                  token: response.access_token,
                  userName: response.userName,
                  refreshToken: response.refresh_token,
                  useRefreshTokens: true
                };
                deferred.resolve(response);

              }).error(function (err) {
                _logOut();
                deferred.reject(err);
              });
            }
          }

          return deferred.promise;
        };

        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = environment.isStatic?_loginStatic:_login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.changePassword = _changePassword;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.refreshToken = _refreshToken;

        return authServiceFactory;
      }]);


//本地验证 $cookieStore

//'use strict';

//angular.module('AngularAuthApp')
//  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
//      var currentUser = {};
//      if ($cookieStore.get('token')) {
//          currentUser = User.get();
//      }

//      return {

//          /**
//           * Authenticate user and save token
//           *
//           * @param  {Object}   user     - login info
//           * @param  {Function} callback - optional
//           * @return {Promise}
//           */
//          login: function (user, callback) {
//              var cb = callback || angular.noop;
//              var deferred = $q.defer();

//              $http.post('/auth/local', {
//                  email: user.email,
//                  password: user.password
//              }).
//              success(function (data) {
//                  $cookieStore.put('token', data.token);
//                  currentUser = User.get();
//                  deferred.resolve(data);
//                  return cb();
//              }).
//              error(function (err) {
//                  this.logout();
//                  deferred.reject(err);
//                  return cb(err);
//              }.bind(this));

//              return deferred.promise;
//          },

//          /**
//           * Delete access token and user info
//           *
//           * @param  {Function}
//           */
//          logout: function () {
//              $cookieStore.remove('token');
//              currentUser = {};
//          },

//          /**
//           * Create a new user
//           *
//           * @param  {Object}   user     - user info
//           * @param  {Function} callback - optional
//           * @return {Promise}
//           */
//          createUser: function (user, callback) {
//              var cb = callback || angular.noop;

//              return User.save(user,
//                function (data) {
//                    $cookieStore.put('token', data.token);
//                    currentUser = User.get();
//                    return cb(user);
//                },
//                function (err) {
//                    this.logout();
//                    return cb(err);
//                }.bind(this)).$promise;
//          },

//          /**
//           * Change password
//           *
//           * @param  {String}   oldPassword
//           * @param  {String}   newPassword
//           * @param  {Function} callback    - optional
//           * @return {Promise}
//           */
//          changePassword: function (oldPassword, newPassword, callback) {
//              var cb = callback || angular.noop;

//              return User.changePassword({ id: currentUser._id }, {
//                  oldPassword: oldPassword,
//                  newPassword: newPassword
//              }, function (user) {
//                  return cb(user);
//              }, function (err) {
//                  return cb(err);
//              }).$promise;
//          },

//          /**
//           * Gets all available info on authenticated user
//           *
//           * @return {Object} user
//           */
//          getCurrentUser: function () {
//              return currentUser;
//          },

//          /**
//           * Check if a user is logged in
//           *
//           * @return {Boolean}
//           */
//          isLoggedIn: function () {
//              return currentUser.hasOwnProperty('role');
//          },

//          /**
//           * Waits for currentUser to resolve before checking if user is logged in
//           */
//          isLoggedInAsync: function (cb) {
//              if (currentUser.hasOwnProperty('$promise')) {
//                  currentUser.$promise.then(function () {
//                      cb(true);
//                  }).catch(function () {
//                      cb(false);
//                  });
//              } else if (currentUser.hasOwnProperty('role')) {
//                  cb(true);
//              } else {
//                  cb(false);
//              }
//          },

//          /**
//           * Check if a user is an admin
//           *
//           * @return {Boolean}
//           */
//          isAdmin: function () {
//              return currentUser.role === 'admin';
//          },

//          /**
//           * Get auth token
//           */
//          getToken: function () {
//              return $cookieStore.get('token');
//          }
//      };
//  });

})(angular.module('mallConsoleApp') );
