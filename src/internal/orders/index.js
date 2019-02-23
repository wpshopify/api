import {
   post
} from '../request';


function endpointOrders() {
   return 'orders';
}

function endpointOrdersCount() {
   return 'orders/count';
}


/*

Get Smart Collections

Returns: promise

*/
function getOrders(data = {}) {
   return post(endpointOrders(), data);
}


/*

Get Smart Collections Count

Returns: promise

*/
function getOrdersCount() {
   return post(endpointOrdersCount());
}


export {
   getOrdersCount,
   getOrders
}
