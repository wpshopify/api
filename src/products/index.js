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
   return client.product.fetchQuery(params);
}


/*

Convience wrappers

*/
function getProduct(id) {
   return fetchProductByID(id, buildClient());
}

function getProducts(ids = []) {
   return fetchProductsByIDs(ids, buildClient());
}

/*

Params Object ::

first	Int	<optional> 20
The relay first param. This specifies page size.

sortKey	String	<optional> ID
The key to sort results by. Available values are documented as Product Sort Keys.
https://help.shopify.com/en/api/custom-storefronts/storefront-api/reference/enum/productsortkeys

query	String	<optional>
A query string. See full documentation here

reverse	Boolean	<optional>
Whether or not to reverse the sort order of the results

Example:

{
  first: 20,
  sortKey: 'CREATED_AT',
  reverse: true
}

*/
function queryProducts(params) {
   return fetchProductsByQuery(params, buildClient());
}

export {
   getProduct,
   getProducts,
   queryProducts
}
