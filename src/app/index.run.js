(function () {
  'use strict';

  angular
    .module('mallConsoleApp')
    .run(runBlock).run(runDebug);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

  function runDebug($rootScope, $state, $stateParams, $log) {
    $rootScope['$state'] = $state;
    $log.debug('$state',$state);
    $rootScope['$stateParams'] = $stateParams;
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      $log.debug('---begin-of-$stateChangeError---',event, toState,toParams,fromState,fromParams,error,'---end-of-$stateChangeError---');
    });
    $rootScope.$on('$stateChangeStart', function (event, state,pos,pos2) {
      //$log.debug('---begin-of-$stateChangeStart---event',event,'state', state,'pos',pos,'---end-of-$stateChangeStart---pos2=',pos2);
    });
  }
})();
