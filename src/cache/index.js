import store from 'store'
import startsWith from 'lodash/startsWith'

function setCache(name, value) {
   return store.set(name, value)
}

function getCache(name) {
   return store.get(name)
}

function deleteCache(name = false) {
   if (!name) {
      return store.clearAll()
   }

   return store.remove(name)
}

function deleteCacheContains(contains) {
   return store.each(function(value, key) {
      if (startsWith(key, contains)) {
         console.log('ffffounnddd key', key)
         console.log('ffffounnddd value', value)
         store.remove(key)
      }
   })
}

export { setCache, getCache, deleteCache, deleteCacheContains }
