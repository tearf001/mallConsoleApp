(function () {
  'use strict';

  angular
    .module('mallConsoleApp')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastr, environment, CKEDITOR, RestangularProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastr.options.timeOut = 3000;
    toastr.options.positionClass = 'toast-top-right';
    toastr.options.preventDuplicates = true;
    toastr.options.progressBar = true;
    RestangularProvider.setBaseUrl(environment.apiBaseUrl);
    CKEDITOR.config.toolbarGroups = [
      { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
      { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
      { name: 'links', groups: [ 'links' ] },
      { name: 'insert', groups: [ 'insert' ] },
      { name: 'forms', groups: [ 'forms' ] },
      { name: 'tools', groups: [ 'tools' ] },
      { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
      { name: 'others', groups: [ 'others' ] },
      '/',
      { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
      { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
      { name: 'styles', groups: [ 'styles' ] },
      { name: 'colors', groups: [ 'colors' ] },
      { name: 'about', groups: [ 'about' ] }
    ];

    config.removeButtons = 'Underline,Subscript,Superscript,Scayt';
  }

    /*鉴权token->headers
     Restangular基于angular $httpProvider在$httpProvider中配置拦截器,见 index.module.js
     console.log('==$httpProvider.interceptors==',$httpProvider.interceptors);
     ```
     app.config(function ($httpProvider) {
     $httpProvider.interceptors.push('authInterceptorService');
     ```
     在RestangularProvider配置略为麻烦,你可以:
     ```
     var x = '2UXtFwgxV90_4HMymesMG2DpgKVZF0X8j3BzyXq7MRGkL_tSUrnMAy3QEjLouFZe9RrHN27gdGTw4t5lvi7mIusgisNXCYAhWaqXG-ikxXuEC-6ZzZ2ItZpRt6_CsOY1is8-cV1u6MnC8LtN1yknBra4cgztZxF4iS5IfWCU1khRvzFOj5Z7GIHV9W1GRQk1y2m0X_-FWUhEFncHWaJvs29T_bRYDTgIaSXseiG7-5NkLt3tbymIDlxz8hQoyC6pV7vDZLcfcWm5BoweIoM6F4WtiEx-DVkpVjVYUMv8Ow2qDoO8q3sdAgnh9WwlQ63Q';
     RestangularProvider.setDefaultHeaders({'Authorization':'bearer '+ x});
     });
     ```
     */



})();
