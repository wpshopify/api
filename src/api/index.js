import isEmpty from 'lodash/isEmpty'
import first from 'lodash/first'
import has from 'lodash/has'

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

AND tag:er tag:kaosjd

{
   filter: 'title',
   value: 'Alice',
   isPrefix: false
}

*/
function queryBuilder(params) {
   // params.isPhrase

   var query = params.filter + ':' + params.value

   if (params.isPrefix) {
      query = query + '*'
   }

   return query
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
      first: params.first,
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
   })
}

/*

Query by tag

*/
function queryByTagParam(value) {
   return queryBuilder({
      filter: 'tag',
      isPrefix: true,
      value: value
   })
}

/*

Query looks like: title:Sm*

*/
function fetchByTitleParams(value) {
   return fetchBuilder({
      first: 10,
      sortKey: 'TITLE',
      query: queryByTitleParam(value),
      reverse: false
   })
}

/*

Query looks like: tag:Sm*

*/
function buildFetchQueryParams(params) {
   return fetchBuilder({
      first: params.first,
      sortKey: params.sortKey,
      query: params.query,
      reverse: params.reverse
   })
}

function formatIdsIntoQuery(ids) {
   if (isEmpty(ids) || !ids) {
      return false
   }

   return ids.map(id => 'id:' + id).join(' OR ')
}

function findLastCursorId(shopifyResponse, dataType) {
   var data = false

   if (has(shopifyResponse.data, dataType)) {
      data = shopifyResponse.data[dataType]
   }

   if (!data || isEmpty(data.edges)) {
      console.log('cursorId no data', data)
      return {
         after: ''
      }
   }

   var cursorId = first(data.edges).cursor
   console.log('cursorId', cursorId)

   return {
      after: cursorId
   }
}

function findTypeFromPayload(payload) {
   return payload.type.name.split('Connection')[0].toLowerCase() + 's'
}

export { fetchByTitleParams, buildFetchQueryParams, formatIdsIntoQuery, findLastCursorId, findTypeFromPayload }
