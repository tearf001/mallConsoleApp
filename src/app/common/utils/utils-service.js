angular.module('mallConsoleApp')
.factory('utils', function ($log,environment) {
  return {
    // Util for finding an object by its 'id' property among an array
    findById: function findById(a, id,key) {
      for (var i = 0; i < a.length; i++) {
        //$log.debug('com---',a[i][key||'id'],id);
        if (a[i][key||'id'] == id)
          return a[i];
      }
      return null;
    },

    // Util for returning a random key from a collection that also isn't the current key
    newRandomKey: function newRandomKey(coll, key, currentKey){
      var randKey;
      do {
        randKey = coll[Math.floor(coll.length * Math.random())][key];
      } while (randKey == currentKey);
      return randKey;
    },
    uploadProductPicFunc: function (UploadService,scope,context) {
      context = context||{};
      context.url = context.url || environment.uploadUrl;
      context.token_value = context.token_value||null;
      context.headers = {'client_id': 'ngAuthApp', 'Authorization': 'bearer ' + context.token_value};
      return function uploadProductPics(files) {
        UploadService.upload({
          url: context.url, // upload.php script, node.js route, or servlet url
          file: files,  // single file or an array of files (array is for html5 only)
          method: 'POST',//
          params: {},
          headers: context.headers, // only for html5
          data: {},
          withCredentials: true,
          transformRequest: angular.identity
          //其他的angular/$http属性 and all other angular $http() options could be used here.
        }).progress(function (evt) {
          scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + scope.progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data) {
          console.log('---uploaded ...', data);
          scope.makeUp(true,data);
        }).error(function (err) {
          console.log('---upload failed ...', err);
          if(environment.isDevelop)
            scope.makeUp(false,files);
        });
      };
    }
  };
});
