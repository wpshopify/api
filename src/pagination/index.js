import { buildClient } from '../client';


/*

Direct API functions

*/
function fetchNextPage(products) {
   return buildClient().fetchNextPage(products);
}

export {
   fetchNextPage
}
