import { buildClient } from '../client'
import { maybeAlterErrorMessage } from '../errors'
import has from 'lodash/has'
import isString from 'lodash/isString'
import to from 'await-to-js'
import { isArray } from 'util'
import md5 from 'js-md5'

function fetchProductByID(id, client) {
  return client.product.fetch(id)
}

function fetchProductsByIDs(ids, client) {
  return client.product.fetchMultiple(ids)
}

function fetchProductsByQuery(params, client) {
  return client.product.fetchQuery(params)
}

function findVariantFromSelectedOptions(product, selectedOptions) {
  return buildClient().product.helpers.variantForOptions(product, selectedOptions)
}

/*

Add product fields to the GQL query

*/
function addProductFields(product) {
  product.add('id')
  product.add('title')
  product.add('availableForSale')
  product.add('createdAt')
  product.add('description')
  product.add('descriptionHtml')
  product.add('handle')
  product.add('onlineStoreUrl')
  product.add('productType')
  product.add('publishedAt')
  product.add('updatedAt')
  product.add('vendor')

  product.addConnection('images', { args: { first: 50 } }, (image) => {
    image.add('altText')
    image.add('src')
  })

  product.add('options', (option) => {
    option.add('name')
    option.add('values')
  })

  //
  // Only works if they are whitelisted first
  //
  // product.addConnection('metafields', { args: { first: 1 } }, metafield => {
  //    metafield.add('namespace')
  //    metafield.add('key')
  //    metafield.add('value')
  // })

  product.addConnection('variants', { args: { first: 50 } }, (variants) => {
    variants.add('id')

    variants.add('product', (options) => {
      options.add('id')
      options.add('title')
    })

    variants.add('title')
    variants.add('price')
    //  variants.add('priceV2')
    variants.add('priceV2', (price) => {
      price.add('amount')
      price.add('currencyCode')
    })

    //  variants.add('unitPrice')
    //  variants.add('quantityAvailable')
    //  variants.add('currentlyNotInStock')
    variants.add('availableForSale')
    variants.add('compareAtPrice')

    variants.add('compareAtPriceV2', (price) => {
      price.add('amount')
      price.add('currencyCode')
    })

    variants.add('sku')
    //  variants.add('fulfillmentService')
    //  variants.add('inventoryManagement')
    variants.add('weight')

    variants.add('selectedOptions', (options) => {
      options.add('name')
      options.add('value')
    })

    variants.add('image', (image) => {
      image.add('src')
      image.add('id')
      image.add('altText')
    })
  })
}

function addProductsCollectionsFields(collection, queryParams) {
  var productsArgs = {
    first: queryParams.first,
    sortKey: queryParams.sortKey,
    reverse: queryParams.reverse,
  }

  collection.addConnection('products', { args: productsArgs }, (product) => {
    addProductFields(product)
  })
}

function addCollectionFields(collection, connectionParams) {
  collection.add('id')
  collection.add('title')
  collection.add('description')
  collection.add('descriptionHtml')
  collection.add('handle')
  collection.add('updatedAt')

  collection.add('image', (image) => {
    image.add('id')
    image.add('altText')
    image.add('src')
    image.add('originalSrc')
  })

  /*
   
   sortKey values:

   TITLE	
   COLLECTION_DEFAULT	
   CREATED	
   ID	
   MANUAL	
   PRICE	
   RELEVANCE	
   BEST_SELLING	

   https://help.shopify.com/en/api/graphql-admin-api/reference/enum/productcollectionsortkeys

   */
  console.log('---------------- connectionParams', connectionParams)

  if (connectionParams) {
    var productsArgs = {
      first: connectionParams.first,
      sortKey: connectionParams.sortKey,
      reverse: connectionParams.reverse,
    }

    collection.addConnection('products', { args: productsArgs }, (product) => {
      addProductFields(product)
    })
  }
}

function enumValue(client, params) {
  return client.graphQLClient.enum(params.sortKey)
}

function enumMake(val) {
  var client = buildClient()
  return client.graphQLClient.enum(val)
}

function maybeUppercaseSortKey(sortKey) {
  if (isString(sortKey)) {
    return sortKey.toUpperCase()
  }

  return sortKey
}

function refetchQuery(node) {
  const client = buildClient()

  return client.graphQLClient.refetch(node)
}

function hasValidCredentials(client) {
  if (has(client, 'type') || has(client, 'message')) {
    return false
  }

  if (client.config.domain && client.config.storefrontAccessToken) {
    return true
  }

  return false
}

function createStringFromQueryParams(queryParams) {
  if (!queryParams.sortKey) {
    var sortKey = ''
  } else {
    if (isString(queryParams.sortKey)) {
      var sortKey = queryParams.sortKey
    } else {
      var sortKey = queryParams.sortKey.key
    }
  }

  if (!queryParams.reverse) {
    var reverse = ''
  } else {
    var reverse = queryParams.reverse
  }

  return queryParams.first + queryParams.query + reverse + sortKey
}

function getHashFromQueryParams(queryParams) {
  return md5(createStringFromQueryParams(queryParams))
}

function sanitizeQueryResponse(response, type) {
  if (type === 'storefront' || type === 'search') {
    type = 'products'
  }

  if (!response.model) {
    return []
  }

  return response.model[type]
}

/*

Fetch NEW items

*/
function fetchNewItems(itemsState) {
  console.log('fetchNewItemsfetchNewItemsfetchNewItems itemsState', itemsState)

  return new Promise(async (resolve, reject) => {
    if (!itemsState) {
      console.error(
        'WP Shopify error: Uh oh, no query parameters were passed for fetchNewItems. Please clear your browser cache and try again.'
      )

      reject({
        type: 'error',
        message: wp.i18n.__(
          'Uh oh, no query parameters were passed for fetchNewItems. Please clear your browser cache and try again.',
          'wpshopify'
        ),
      })
    }

    console.log('fetchNewItems itemsState.queryParams', itemsState.queryParams)

    var hashCacheId = getHashFromQueryParams(itemsState.queryParams)

    if (has(itemsState.payloadCache, hashCacheId)) {
      resolve(itemsState.payloadCache[hashCacheId])
    }

    const [resultsError, results] = await to(
      graphQuery(itemsState.dataType, itemsState.queryParams, itemsState.connectionParams)
    )

    if (resultsError) {
      reject({ type: 'error', message: maybeAlterErrorMessage(resultsError) })
      return
    }

    var newItems = sanitizeQueryResponse(results, itemsState.dataType)

    resolve(newItems)
  })
}

function isSearchingForCollections(query) {
  return query.includes('collection:')
}

function modQueryForProductsCollections(query) {
  return query.replace(/collection:/g, 'title:')
}

function isProductsCollectionsQuery(type, queryParams) {
  return type === 'products' && isSearchingForCollections(queryParams.query)
}

function modResponseProductsCollections(response) {
  return {
    model: {
      products: response.model.collections.length ? response.model.collections[0].products : [],
    },
  }
}

function graphQuery(type, queryParams, connectionParams = false) {
  return new Promise(async (resolve, reject) => {
    if (!queryParams) {
      return reject(
        maybeAlterErrorMessage(
          wp.i18n.__(
            'Uh oh, it looks your query params are invalid. Please clear your browser cache and reload the page.',
            'wpshopify'
          )
        )
      )
    }

    const client = buildClient()

    if (!hasValidCredentials(client)) {
      return reject(
        maybeAlterErrorMessage(
          wp.i18n.__(
            'You still need to connect your Shopify store or the credentials are missing. Double check the "connect" tab within the plugin settings.',
            'wpshopify'
          )
        )
      )
    }

    if (type === 'storefront' || type === 'search') {
      type = 'products'
    }

    if (queryParams.query === undefined || queryParams.query === '') {
      queryParams.query = '*'
    }
    console.log('type', type)
    console.log('queryParams', queryParams)
    if (isProductsCollectionsQuery(type, queryParams)) {
      console.log('isProductsCollectionsQuery', isProductsCollectionsQuery)

      var hasProductsCollectionsQuery = true
      queryParams.query = modQueryForProductsCollections(queryParams.query)
      type = 'productsCollections'
    } else {
      var hasProductsCollectionsQuery = false
    }

    if (has(queryParams, 'sortKey')) {
      queryParams.sortKey = maybeUppercaseSortKey(queryParams.sortKey)
      queryParams.sortKey = enumValue(client, queryParams)
    }

    if (has(connectionParams, 'sortKey')) {
      connectionParams.sortKey = maybeUppercaseSortKey(connectionParams.sortKey)
      connectionParams.sortKey = enumValue(client, connectionParams)
    }

    // Defaults to 10
    if (!has(queryParams, 'first') && !has(queryParams, 'last')) {
      queryParams.first = 10
    }

    var query = client.graphQLClient.query((root) => {
      resourceQuery(root, type, queryParams, connectionParams)
    })

    const [requestError, response] = await to(client.graphQLClient.send(query))

    if (requestError) {
      return reject(maybeAlterErrorMessage(requestError))
    }

    if (has(response, 'errors')) {
      return reject(maybeAlterErrorMessage(response.errors))
    }

    if (hasProductsCollectionsQuery) {
      return resolve(modResponseProductsCollections(response))
    }

    return resolve(response)
  })
}

function resourceQuery(root, type, queryParams, connectionParams = false) {
  switch (type) {
    case 'products':
      productsQuery(root, queryParams)
      break

    case 'productsCollections':
      productsCollectionsQuery(root, queryParams)
      break

    case 'collections':
      collectionsQuery(root, queryParams, connectionParams)
      break

    default:
      break
  }
}

function productsQuery(root, queryParams) {
  root.addConnection('products', { args: queryParams }, (product) => {
    addProductFields(product)
  })
}

function collectionsQuery(root, queryParams, connectionParams = false) {
  root.addConnection('collections', { args: queryParams }, (collection) => {
    addCollectionFields(collection, connectionParams)
  })
}

function productsCollectionsQuery(root, queryParams) {
  root.addConnection(
    'collections',
    { args: { query: queryParams.query, first: 1 } },
    (collection) => {
      addProductsCollectionsFields(collection, queryParams)
    }
  )
}

function refetchLineItems(ids, client) {
  return new Promise(async (resolve, reject) => {
    if (!ids || !isArray(ids)) {
      return reject(wp.i18n.__('No product ids found', 'wpshopify'))
    }

    var allPromises = ids.map(async (id) => {
      const [err, succ] = await to(fetchProductByID(id, client))

      if (!err) {
        return succ
      }
      return err
    })

    var [allPromiseError, allPromiseResponse] = await to(Promise.all(allPromises))

    if (allPromiseError) {
      reject(maybeAlterErrorMessage(allPromiseError))
    }

    resolve(allPromiseResponse)
  })
}

function isTypeError(data) {
  return data instanceof Error
}

function withoutTypeErrors(results) {
  return results.filter((result) => !isTypeError(result))
}

function getProductsFromIds(ids = []) {
  return new Promise(async (resolve, reject) => {
    const client = buildClient()

    const [productsError, products] = await to(fetchProductsByIDs(ids, client))

    // If productsError, most likely the product was hidden from the sales channel
    if (productsError) {
      console.error('WP Shopify Error fetchProductsByIDs', productsError)
      const [refetchError, results] = await to(refetchLineItems(ids, client))

      if (refetchError) {
        console.error('WP Shopify Error refetchLineItems', refetchError)
        return reject(maybeAlterErrorMessage(refetchError))
      }

      return resolve(withoutTypeErrors(results))
    }

    return resolve(products)
  })
}

function queryProducts(params) {
  return fetchProductsByQuery(params, buildClient())
}

function getAllTags() {
  return fetchAllTags()
}

export {
  getProductsFromIds,
  queryProducts,
  getAllTags,
  findVariantFromSelectedOptions,
  graphQuery,
  refetchQuery,
  enumMake,
  fetchNewItems,
}
