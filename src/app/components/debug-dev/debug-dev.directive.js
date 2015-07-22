(function() {
  'use strict';

  angular
    .module('mallConsoleApp')
    .directive('debugDev', debugDev);

  /** @ngInject */
  function debugDev() {

    return {
      restrict: 'E',
      templateUrl: 'app/components/debug-dev/debug-dev.html'
    };
  }

})();
