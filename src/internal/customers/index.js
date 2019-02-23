import {
   post
} from '../request';

/*

Customers Endpoints

*/
function endpointCustomers() {
   return 'customers';
}

function endpointCustomersCount() {
   return 'customers/count';
}

/*

Get Smart Collections

Returns: promise

*/
function getCustomers(data = {}) {
   return post(endpointCustomers(), data);
}


/*

Get Smart Collections Count

Returns: promise

*/
function getCustomersCount() {
   return post(endpointCustomersCount());
}


export {
   getCustomersCount,
   getCustomers
}
