/**
 * Created by Administrator on 2015/7/3.
 */
(function () {
    angular.module('learn.rating', [])
        .constant('ratingConfig', {
            max: 5,
            stateOn: 'glyphicon-star', //配置ON视觉
            stateOff: 'glyphicon-star-empty' //配置off视觉
        })
        .directive('rating', function () {
            return {
                restrict: 'EA',
                require: ['ngModel','rating'],//依赖的申明.link的时候,就会放入第四个参数.注意参数是该指令作用域上的控制器
                scope:{
                    readOnly:'=?',
                    onHover:'&', //==mouseenter?
                    onLeave:'&'  //==mouseleave
                },
                controller:'ratingCtrl',
                template: '<span ng-mouseleave="reset()" tabindex="0" role="slider">\n    ' +
                '<i ng-repeat="r in range track by $index" \n' +
                '       ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" \n' +
                '       class="glyphicon" \n' +
                '       ng-class="$index < value && (r.stateOn ) || (r.stateOff )">\n' +
                '</i></span>',
                replace:true,
                link: function (scope,ele,attrs,ctrls) {
                    var ratingCtrl = ctrls[1],ngModelCtrl =ctrls[0];
                    ratingCtrl.init(ngModelCtrl);
                }
            }

        }).controller('ratingCtrl',
        ['$scope', '$attrs', 'ratingConfig',
            function ($scope, $attrs, ratingConfig) {
                var self = this;
                var ngModelCtrl = {
                    $setViewValue: angular.noop //空函数
                };
                self.render = function () {
                    return $scope.value = ngModelCtrl.$viewValue;
                }
                self.init = function (ngModelCtrl_) {
                    //ngModel的配置,初始化
                    ngModelCtrl = ngModelCtrl_;
                    ngModelCtrl.$render = self.render;//$render
                    //ngModelCtrl 反向绑定
                    ngModelCtrl.$formatters.push(angular.noop);
                    self.stateOn = $attrs.stateOn||ratingConfig.stateOn;
                    self.stateOff =$attrs.stateOff||ratingConfig.stateOff;
                    var ratingStates = new Array(angular.isDefined($attrs.max)?$scope.$parent.$eval($attrs.max):ratingConfig.max);
                    $scope.range = this.buildTemplateObjects(ratingStates);
                }
                self.buildTemplateObjects = function (states) {
                    for(var i=0;i<states.length;i++){
                        states[i] = angular.extend({index:i},{stateOn:self.stateOn,stateOff:self.stateOff},states[i]);
                    }
                    return states;
                }
                $scope.rate = function (value) {
                    if(!$scope.readOnly && value>=0 && value<=$scope.range.length){
                        ngModelCtrl.$setViewValue(value);
                        ngModelCtrl.$render();
                    }
                }
                $scope.enter = function (value) {
                    if(!$scope.readOnly) $scope.value = value;
                    $scope.onHover({value:value});
                };
                $scope.reset = function () {
                    $scope.value = ngModelCtrl.$viewValue;
                    $scope.onLeave();
                }
                //对上下左右的控制 ---放弃
            }])
})();