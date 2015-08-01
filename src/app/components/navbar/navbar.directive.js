(function() {
  'use strict';

  angular
    .module('mallConsoleApp')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
        creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController($state, authService) {
      var vm = this;
      vm.logOut = function () {
        authService.logOut();
        $state.go('home');
        //, {reload : Math.random()},   {reload: true, inherit: true, notify: true}
      };
      vm.authentication = authService.authentication;
    }
  }

})();
