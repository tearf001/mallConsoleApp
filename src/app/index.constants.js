/* global malarkey:false, toastr:false, moment:false */
(function() {
  'use strict';

  angular
    .module('mallConsoleApp')
    .constant('malarkey', malarkey)
    .constant('toastr', toastr)
    .constant('moment', moment)
    .constant('CKEDITOR',CKEDITOR)
  ;
})();
