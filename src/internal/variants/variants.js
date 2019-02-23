import {
   post
} from '../request';

function endpointVariants() {
   return 'variants';
}

/*

Gets products

Returns: promise

*/
function getVariantIdFromOptions(data = {}) {
   return post(endpointVariants(), data);
}

export {
   getVariantIdFromOptions
}
