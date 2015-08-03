(function() {
  'use strict';

  angular
    .module('mallConsoleApp')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastr,ckeditor) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastr.options.timeOut = 3000;
    toastr.options.positionClass = 'toast-top-right';
    toastr.options.preventDuplicates = true;
    toastr.options.progressBar = true;
    ckeditor.config.toolbarGroups = [
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

})();
