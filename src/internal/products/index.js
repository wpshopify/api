import { post, get } from '../request';


function endpointProducts() {
   return 'products';
}

function endpointProductsCount() {
   return 'products/count';
}

function endpointPublishedProductIds() {
   return 'products/ids';
}

function endpointGetAllProductTags() {
   return 'products/tags';
}

function endpointGetAllProductVendors() {
   return 'products/vendors';
}



/*

Gets products

Returns: promise

*/
function getProducts(data = {}) {
   return post(endpointProducts(), data);
}


/*

Gets products count

Returns: promise

*/
function getProductsCount() {
   return post(endpointProductsCount());
}


/*

Gets published product ids

Returns: promise

*/
function getPublishedProductIds() {
   return post(endpointPublishedProductIds());
}


function getAllTags() {
   return get(endpointGetAllProductTags());
}

function getAllVendors() {
   return get(endpointGetAllProductVendors());
}


function getFilterData() {
   return Promise.all([
      getAllTags(),
      getAllVendors()
   ]);
}


export {
   getProductsCount,
   getProducts,
   getPublishedProductIds,
   getAllTags,
   getFilterData
}
