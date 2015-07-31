(function () {
  'use strict';
  angular.module('mallConsoleApp')
    .config(
    ['$stateProvider', '$urlRouterProvider',
      function ($stateProvider) { //$urlRouterProvider
        $stateProvider
          .state('products', {  //根
            url: '/products',
            abstract: true,     //抽象状态-其状态不可直接激活,而由其子状态激活,那么其视图模板中的ui-view即为子状态视图填充
            templateUrl: 'app/products/products.html',
            resolve: {
              productTypes: function (Restangular) {
                return Restangular.all('products').all('types').getList();
              }
            },
            controller: ['$scope', '$state', '$http', '$timeout', 'Upload', 'productTypes',
              function ($scope, $state, $http, $timeout, Upload, productTypes) {
                $scope.productTypes = productTypes;
              }]
          })
          .state('products.overview', {
            url: '',
            templateUrl: 'app/products/products.overview.html'
          })
          .state('products.template', { //特定类型下列表
            url: '/tmpl/{tmplId:[0-9]+}',
            resolve: {
              //每次进入前重新加载
              tmplProducts: function (utils , $stateParams,Restangular) {
                return Restangular.all('products').one('tmpl',$stateParams.tmplId).getList();
              }
            },
            views: {
              '': {
                templateUrl: function ($stateParams) {
                  return 'app/products/tmpl' + $stateParams.tmplId + '.html';
                },
                controllerProvider: function ($stateParams) {
                  return 'productsType' + "Controller";//+ $stateParams.tmplId ,如果需要多个控制器,那么引入注释部分
                }
              }
            }
          })
          .state('products.template.single', { //单个商品详情
            url: '/{prodId:[0-9]+}',
            templateUrl: 'app/products/products.single.html',                         //tmplProducts 由父状态继承
            resolve:{
              productInfo: function (Restangular,$stateParams) {
                return Restangular.one('products',$stateParams.prodId).getList().then(function (data) {
                  console.log('!!!!',data);
                  return data;
                });
              },
              initType: function () {
                return 0;
              }
            },
            controller: ['$scope', '$stateParams', '$state', 'utils', '$log', '$history','tmplProducts', 'productInfo',
              function ($scope, $stateParams, $state, utils, $log, $history,tmplProducts, productInfo) {
                //从数据库中加载,或者从客户端缓冲中加载
                var productIns = utils.findById(tmplProducts, $stateParams.prodId,'productID');//从客户端缓冲中取数
                //$scope.singleProduct = Restangular.one('products',$stateParams.prodId).$object;//从服务端取数
                //单个商品,必须要扩展 productInfo.具体模型不知,可参考对应的设计者
                $scope.singleProduct = angular.extend({},productIns,{prodInfo:productInfo}) ;
                $log.debug('--singleProduct@products.single!--', $scope.singleProduct, '--productIns--',productIns);
                $scope.$stateParams = $stateParams;

                $scope.prodInfoTabs = _.map($scope.singleProduct.prodInfo, function (e,i) {
                  return _.extend({},e,{ active__: i==0});
                });

                $scope.back = function () {
                  $history.back();
                };
                $scope.edit = function (index) {
                  if(index===0)
                    $state.go('.edit', $stateParams);
                  if(index===1)
                    $state.go('.edit');
                };
              }]
          })
          .state('products.template.single.edit', { //单个商品编辑
            views: {
              // This is targeting the unnamed view within the 'contacts.detail' state
              // essentially swapping out the template that 'contacts.detail.item' had
              // inserted with this state's template.
              '@products': { //'@products' 时占用母页ui-view区域; 原来由 @products.template.single视图填充
                templateUrl: 'app/products/products.single.edit.html',
                resolve: {
                  //每次进入前重新加载
                  singleProduct: function (utils, Restangular, $stateParams) {
                    return Restangular.all('products').one($stateParams.prodId).get().then(function (data) {
                      return data;
                    }, function (err) {
                      return err;
                    });
                  }
                },
                controller: ['$scope', '$log', '$stateParams', '$state', 'utils', '$modal', 'singleProduct',
                  function ($scope, $log, $stateParams, $state, utils, $modal, singleProduct) {
                    $log.info(singleProduct);
                    //编辑时,需重新从数据库中加载最新数据
                    $scope.singleProduct = angular.extend(singleProduct, {_files: []});//utils.findById(tmplProducts,$stateParams.prodId);//从客户端缓冲中取数
                    $scope.done = function () {
                      console.log('--singleProduct@products.single.edit--$stateParams:', $stateParams);
                      // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.
                      $state.go('^.^', $stateParams);
                    };
                    //商品图片url序列
                    //$scope.orderImages=$scope.singleProduct.orderImages;
                    //新加的图片
                    //$scope.singleProduct.files = [];
                    //$scope.tinymce = tinymce;
                    $scope.tinymceOptions = {
                      onChange: function (e) {
                        // put logic here for keypress and cut/paste changes
                      },
                      inline: false,
                      plugins: 'code advlist autolink link image lists charmap preview',
                      skin: 'lightgray',
                      theme: 'modern',
                      lang: 'zh_CN'
                    };
                    $scope.ckeditorOptions = ckeditorConfig();
                    //$scope.onReadyConfig = function(){
                    //  ckeditorConfig(CKEDITOR);
                    //};
                    $scope.pickBack = undefined;
                    $scope.openImgPicker = function () { //打开情态窗口
                      var modalInstance = $modal.open({
                        animation: false,
                        templateUrl: 'app/components/img-picker/img-picker.html',
                        controller: 'imgPickerModalInsCtrl',
                        size: 'lg',
                        resolve: {
                          inData: function () {
                            return "Hello";
                          }
                        }
                      });
                      modalInstance.result.then(function (pickBack) {
                        $scope.pickBack = pickBack;
                        $log.info('Modal return with: ', pickBack);
                        var oEditor = CKEDITOR.instances.editor1;
                        _.forEach(pickBack, function (ins) {
                          //tinymce.activeEditor.execCommand('mceInsertContent', false, i);
                          var newElement = CKEDITOR.dom.element.createFromHtml(ins, oEditor.document);
                          oEditor.insertElement(newElement);

                        });

                      }, function (e) {
                        $log.info('Modal dismissed at: ', e);
                      });
                    }
                  }]
              }
            }
          });
      }
    ]
  )
    //tmplProducts ,加载时 resolve获得
    .controller('productsTypeController', ['$scope', '$state', '$stateParams', '$http', '$timeout', 'Upload', 'utils', 'tmplProducts',
      function ($scope, $state, $stateParams, $http, $timeout, Upload, utils, tmplProducts) {
        console.log('--tmplProducts@productsTypeController:', tmplProducts);
        var self = $scope;//this;
        self.products = tmplProducts;
        self.newItem = {};
        self.states = {newForm: false, isAdding: false};
        self.showForm = function (sf) {
          self.states.newForm = sf;
        };
        self.addProduct = function (prod) {
          self.states.isAdding = true;
          //$http.post(prod).then...
          $timeout( //模拟HTTP请求
            self.products.push(prod)
            , 100)
            //动态效果消失
            .finally(function () {
              self.states.isAdding = false;
              self.newItem = {};
            });
        };
        self.files = [];
        self.upload = utils.uploadProductPicFunc(Upload, self);
        self.goExplicit = function (ps) {
          $state.go('products.template.single', ps);
        }
      }]);

  ///////////////////逻辑结束////////////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  ///////////////////多文本编辑器配置////////////////////////////
  function ckeditorConfig() {
    var config = {};
    return config; //all - default config
    function fn(config) {
      // Define changes to default configuration here. For example:
      // config.language = 'fr';
      // config.uiColor = '#AADC6E';Source

      config.extraPlugins = 'smiley,codesnippet,image2';
      config.toolbar = [
        {
          name: 'document',
          groups: ['mode', 'document', 'doctools'],
          items: ['Source', '-', 'NewPage', 'Preview', '-', 'Templates']
        },
        {
          name: 'basicstyles',
          groups: ['basicstyles', 'cleanup'],
          items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat']
        },
        {
          name: 'paragraph',
          groups: ['blocks', 'align'],
          items: ['Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
        },
        {name: 'insert', groups: ['media'], items: ['Image2', 'Smiley', 'CodeSnippet', 'Image']},
        {name: 'links', items: ['Link']},
        {name: 'styles', items: ['Font', 'FontSize']},
        {name: 'colors', items: ['TextColor', 'BGColor']},
        {name: 'tools', items: ['Maximize', 'ShowBlocks']},
        {name: 'about', items: ['About']}
      ];

      // Toolbar groups configuration.
      config.toolbarGroups = [
        {name: 'document', groups: ['mode', 'document', 'doctools']},
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
        {name: 'forms'},
        '/',
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
        {name: 'paragraph', groups: ['blocks', 'align']},
        {name: 'links'},
        {name: 'insert', groups: ['media']},
        '/',
        {name: 'styles'},
        {name: 'colors'},
        {name: 'tools'},
        {name: 'about'}
      ];
      config.codeSnippet_languages = {
        cpp: 'C++',
        cs: 'C#',
        css: 'CSS',
        html: 'HTML',
        http: 'HTTP',
        java: 'Java',
        javascript: 'JavaScript',
        json: 'JSON',
        objectivec: 'Objective-C',
        perl: 'Perl',
        python: 'Python',
        sql: 'SQL',
        vbscript: 'VBScript',
        xml: 'XML'
      };
      config.codeSnippet_theme = "default";
    }

    fn(config);
    return config;
  }

})();
