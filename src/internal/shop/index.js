import {
   post
} from '../request';


function endpointShop() {
   return 'shop';
}

function endpointShopCount() {
   return 'shop/count';
}

/*

Get Smart Collections

Returns: promise

*/
function getShop(data = {}) {
   return post(endpointShop(), data);
}


/*

Get Smart Collections Count

Returns: promise

*/
function getShopCount() {
   return post(endpointShopCount());
}


export {
   getShopCount,
   getShop
}
