import { buildClient } from '../client';



/*

Direct API functions

*/
function fetchProductByID(id, client) {
   return client.product.fetch(id);
}

function fetchProductsByIDs(ids, client) {
   return client.product.fetchMultiple(ids);
}

function fetchProductsByQuery(params, client) {

   console.log('Final query :: ', params.query);

   return client.product.fetchQuery(params);

}

function findVariantFromSelectedOptions(product, selectedOptions) {
   return buildClient().product.helpers.variantForOptions(product, selectedOptions);
}

function fetchAllProducts(client) {
   return client.product.fetchAll();
}

function fetchNextPage(items, client) {
   return client.fetchNextPage(items);
}


/*

Convience wrappers

*/
function getProduct(id) {
   return fetchProductByID(id, buildClient());
}

async function getProducts(ids = []) {

   return fetchProductsByIDs(ids, buildClient());

}

function getAllProducts() {
   return fetchAllProducts(buildClient());
}

function queryProducts(params) {
   return fetchProductsByQuery(params, buildClient());
}

function getNextPage(items) {
   return fetchNextPage(items, buildClient());
}

function getAllTags() {
   return fetchAllTags();
}

export {
   getProduct,
   getProducts,
   getAllProducts,
   queryProducts,
   getNextPage,
   getAllTags,
   findVariantFromSelectedOptions
}
