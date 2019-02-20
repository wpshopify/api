function setCache(name, value) {
   return localStorage.setItem(name, value);
}

function getCache(name) {
   return localStorage.getItem(name);
}

function deleteCache(name = false) {

   if (!name) {
      return localStorage.clear();
   }

   return localStorage.removeItem(name);

}

export {
   setCache,
   getCache,
   deleteCache
}
