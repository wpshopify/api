import {
   post
} from '../request';


function endpointToolsClearCache() {
   return 'cache';
}

function endpointToolsClearAll() {
   return 'clear/all';
}

function endpointToolsClearSynced() {
   return 'clear/synced';
}



/*

Gets published product ids

Returns: promise

*/
function clearCache() {
   return post(endpointToolsClearCache());
}


export {
   clearCache
}
