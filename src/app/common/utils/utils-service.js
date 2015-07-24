angular.module('mallConsoleApp')
.factory('utils', function ($log) {
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
    uploadProductPicFunc: function (UploadService,scope,authData) {
      authData = authData||{};
      authData.url = authData.url || "http://localhost:7245/api/fileUp";
      authData.token_value = authData.token_value || 'Auud7Gv4MNiuoodyUbucRHCD2wMYYoy1Npq3JipXBd4bumEK7IsnIMEvz8qFj1jT06ovxHnBowHE6brVy2diSOYUCr7-OL_Z-ONWymj2HJmBi69JdfnVMAz1U40WnAew1FCSLy8DUkMN9rJ07qsBpGQe4j9gCzBGCeNiuF9Al5AUAFaTpvq6dfGKtWuloJPtJXXvXaRQ0-_jUeYO8VAQKsKchQjcvyol_4nWzDaBl_zcP0MCU_bb-UQOeDDBaLd9-zDOrLGiMSjxDNajZ-6cZQ';
      authData.headers = {'client_id': 'ngAuthApp', 'Authorization': 'bearer ' + authData.token_value};
      return function uploadProductPics(files) {
        UploadService.upload({
          url: url, // upload.php script, node.js route, or servlet url
          file: files,  // single file or an array of files (array is for html5 only)
          method: 'POST',//
          params: {},
          headers: authData.headers, // only for html5
          data: {},
          withCredentials: true,
          transformRequest: angular.identity
          //其他的angular/$http属性 and all other angular $http() options could be used here.
        }).progress(function (evt) {
          scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data) {
          console.log('---uploaded ...', data);
        }).error(function (err) {
          console.log('---upload failed ...', err);
        });
      };
    }
  };
});
