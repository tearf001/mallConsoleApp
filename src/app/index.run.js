(function () {
  'use strict';

  angular
    .module('mallConsoleApp')
    .run(runBlock).run(runDebug);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

  function runDebug($rootScope, $state, $stateParams, $log,authService) {
    $rootScope.authentication = authService.authentication;
    $rootScope.$state = $state;
    $log.debug('$state',$state);
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      $log.error('---begin-of-$stateChangeError---',event, toState,toParams,fromState,fromParams,error,'---end-of-$stateChangeError---');
    });
    //$rootScope.$on('$stateChangeStart', function () {
    //  //$log.debug('---begin-of-$stateChangeStart---event',event,'state', state,'pos',pos,'---end-of-$stateChangeStart---pos2=',pos2);
    //});
  }
})();
