/*

Supported filter parameters: https://help.shopify.com/en/api/graphql-admin-api/reference/queryroot#products

Search Syntax: https://help.shopify.com/en/api/getting-started/search-syntax

barcode
created_at
delivery_profile_id
error_feedback
gift_card
inventory_total
out_of_stock_somewhere
product_type
published_status
sku
tag
title
updated_at
vendor


{
   filter: 'title',
   value: 'Alice',
   isPrefix: false
}

*/
function queryBuilder(params) {

   // params.isPhrase

   var query = params.filter + ':' + params.value;

   if (params.isPrefix) {
      query = query + "*";
   }

   return query;

}


/*

Fetch Builder:

Sort Keys: https://help.shopify.com/en/api/custom-storefronts/storefront-api/reference/enum/productsortkeys

vendor
created_at
id
price
product_type
relevance
title
updated_at
best_selling

*/
function fetchBuilder(params) {

   return {
      first: params.pageSize,
      sortKey: params.sortKey,
      query: params.query,
      reverse: params.reverse
   }

}


/*

Query by title

*/
function queryByTitleParam(value) {

   return queryBuilder({
      filter: 'title',
      isPrefix: true,
      value: value
   });

}


/*

Query by tag

*/
function queryByTagParam(value) {

   return queryBuilder({
      filter: 'tag',
      isPrefix: true,
      value: value
   });

}


/*

Query looks like: title:Sm*

*/
function fetchByTitleParams(value) {

   return fetchBuilder({
      pageSize: 20,
      sortKey: 'TITLE',
      query: queryByTitleParam(value),
      reverse: false
   });

}


/*

Query looks like: tag:Sm*

*/
function fetchByTagParams(value) {

   return fetchBuilder({
      pageSize: 20,
      sortKey: 'TITLE',
      query: queryByTagParam(value),
      reverse: false
   });

}

export {
   fetchByTitleParams,
   fetchByTagParams
}