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
    }
  };
});
