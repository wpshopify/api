import store from 'store';

function setCache(name, value) {
   return store.set(name, value);
}

function getCache(name) {
   return store.get(name);
}

function deleteCache(name = false) {

   if (!name) {
      return store.clearAll();
   }

   return store.remove(name);

}

export {
   setCache,
   getCache,
   deleteCache
}