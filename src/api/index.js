import isEmpty from 'lodash/isEmpty'
import first from 'lodash/first'
import has from 'lodash/has'

/*

Supported filter parameters: https://help.shopify.com/en/api/storefront-api/reference/queryroot#products-2019-07
Search Syntax: https://help.shopify.com/en/manual/sell-online/online-store/storefront-search#prefix-search

available_for_sale
created_at
product_type
tag
title
updated_at
variants.price
vendor

AND tag:er tag:kaosjd

{
   filter: 'title',
   value: 'Alice',
   isPrefix: false
}

*/
function queryBuilder(params = { isPrefix: false, filter: 'title', value: '*', phrase: false }) {
  // var query = '';

  if (!params.value) {
    return
  }

  if (params.phrase) {
    params.value = '"' + params.value + '"'
  } else {
    params.value = params.value + '*'
  }

  return params.filter + ':' + params.value
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
    reverse: params.reverse,
  }
}

/*

Query by tag

*/
function queryByTagParam(value) {
  return queryBuilder({
    filter: 'tag',
    isPrefix: true,
    value: value,
  })
}

function findLastCursorId(shopifyResponse, dataType) {
  var data = false

  if (has(shopifyResponse.data, dataType)) {
    data = shopifyResponse.data[dataType]
  }

  if (!data || isEmpty(data.edges)) {
    return {
      after: '',
    }
  }

  var cursorId = first(data.edges).cursor

  return {
    after: cursorId,
  }
}

export { findLastCursorId, queryBuilder }
