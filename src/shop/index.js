import { buildClient } from '../client';


/*

Direct API functions

*/
function fetchShopInfo(client) {
   return client.shop.fetchInfo();
}


/*

Convience wrappers

*/
function getShopInfo() {
   return fetchShopInfo(buildClient());
}

export {
   getShopInfo
}
