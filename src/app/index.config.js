(function() {
  'use strict';

  angular
    .module('mallConsoleApp')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastr,environment,RestangularProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastr.options.timeOut = 3000;
    toastr.options.positionClass = 'toast-top-right';
    toastr.options.preventDuplicates = true;
    toastr.options.progressBar = true;
    RestangularProvider.setBaseUrl(environment.apiBaseUrl);
    var x = '2UXtFwgxV90_4HMymesMG2DpgKVZF0X8j3BzyXq7MRGkL_tSUrnMAy3QEjLouFZe9RrHN27gdGTw4t5lvi7mIusgisNXCYAhWaqXG-ikxXuEC-6ZzZ2ItZpRt6_CsOY1is8-cV1u6MnC8LtN1yknBra4cgztZxF4iS5IfWCU1khRvzFOj5Z7GIHV9W1GRQk1y2m0X_-FWUhEFncHWaJvs29T_bRYDTgIaSXseiG7-5NkLt3tbymIDlxz8hQoyC6pV7vDZLcfcWm5BoweIoM6F4WtiEx-DVkpVjVYUMv8Ow2qDoO8q3sdAgnh9WwlQ63Q';
    RestangularProvider.setDefaultHeaders({'Authorization':'bearer '+ x});
  }

})();
