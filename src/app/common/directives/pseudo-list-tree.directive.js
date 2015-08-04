/**
 * Created by Administrator on 2015/7/24.
 */
(function () {
  "use strict";
  angular
    .module('mallConsoleApp')
    .directive('pseudoListTree', function() {
      return {
        restrict:'EA',
        template: '<div ui-tree>\n  <ul ui-tree-nodes="" ng-model="innerTree">\n    <li ng-repeat="node in innerTree" ui-tree-node>\n\n      <div class="tree-node" ui-tree-handle>\n        <div class="pull-left tree-handle">\n          <span class="glyphicon glyphicon-list"></span>\n        </div>\n        <div class="tree-node-content">\n          {{node.title}}\n          <!--<a class="pull-right btn btn-danger btn-xs" data-nodrag ng-click="remove(this)">-->\n            <!--<span class="glyphicon glyphicon-remove"></span></a>-->\n        </div>\n      </div>\n\n\n    </li>\n  </ul>\n</div>',
        scope:{
          innerTree:'=ngModel'
        }
      };
    });
})();



