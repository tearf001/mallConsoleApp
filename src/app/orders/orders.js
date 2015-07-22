/**
 * Created by Administrator on 2015/7/1.
 */
angular.module('mallConsoleApp').config(
    ['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('orders', {
                    abstract: true,//由最近子状态填充,如果没有这个属性,或者属性为false,那么子状态不会被加载!
                    url: '/orders',
                    templateUrl: 'app/orders/orders.html',
                    resolve: {
                        orders: ['ordersService',
                            function (orderService) {
                                return orderService.all();
                            }]
                    },
                    controller: ['$scope', '$state', 'orders',
                        function ($scope, $state, orders) {
                            console.log(orders);
                            $scope.orders = orders;
                            $scope.selectOrder = function (order) {
                                $scope.orderSelected=order;
                            }
                            $scope.deliverys= {};
                            angular.forEach(orders,function (order) {
                                $scope.deliverys[order.orderNo]= false;
                            });
                            $scope.viewDelivery = function (orderNo) {
                                $scope.deliverys[orderNo]=!$scope.deliverys[orderNo];
                            }
                            $scope.limitTo = 3;
                            $scope.orderStates = ["", "未支付订单", "待发货订单", "待收货订单", "待评价订单"];
                            $scope.selectedState = $scope.orderStates[0];
                            $scope.goToDetail = function (id) {
                                $state.go('orders.detail', {orderId: id});
                            };
                        }]
                })
                .state('orders.list', {
                    url: '',
                    templateUrl: 'app/orders/orders.list.html'
                })
        }
    ]
);


