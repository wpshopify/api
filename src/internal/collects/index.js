import {
   post
} from '../request';


/*

Collects Endpoints

*/
function endpointCollects() {
   return 'collects';
}

function endpointCollectsCount() {
   return 'collects/count';
}

/*

Get Smart Collections

Returns: promise

*/
function getCollects(data = {}) {
   return post(endpointCollects(), data);
}


/*

Get Smart Collections Count

Returns: promise

*/
function getCollectsCount() {
   return post(endpointCollectsCount());
}


export {
   getCollectsCount,
   getCollects
}
