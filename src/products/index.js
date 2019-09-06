import { buildClient } from '../client'
import { maybeAlterErrorMessage } from '../errors'
import has from 'lodash/has'
import isString from 'lodash/isString'
import to from 'await-to-js'

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

   product.addConnection('images', { args: { first: 250 } }, image => {
      image.add('altText')
      image.add('src')
   })

   product.add('options', option => {
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

   product.addConnection('variants', { args: { first: 250 } }, variants => {
      variants.add('id')
      variants.add('product')
      variants.add('title')
      variants.add('price')
      variants.add('availableForSale')
      variants.add('compareAtPrice')

      variants.add('selectedOptions', options => {
         options.add('name')
         options.add('value')
      })

      variants.add('image', image => {
         image.add('src')
         image.add('id')
         image.add('altText')
      })
   })
}

function addCollectionFields(collection, connectionParams) {
   collection.add('id')
   collection.add('title')
   collection.add('description')
   collection.add('descriptionHtml')
   collection.add('handle')
   collection.add('updatedAt')

   collection.add('image', image => {
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

   if (connectionParams) {
      var productsArgs = {
         first: connectionParams.first,
         sortKey: connectionParams.sortKey,
         reverse: connectionParams.reverse
      }

      collection.addConnection('products', { args: productsArgs }, product => {
         addProductFields(product)
      })
   }
}

function enumValue(client, params) {
   return client.graphQLClient.enum(params.sortKey)
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

function graphQuery(type, queryParams, connectionParams = false) {
   return new Promise(async (resolve, reject) => {
      if (!queryParams) {
         return reject(maybeAlterErrorMessage('Uh oh, it looks your query params are invalid. Please clear your browser cache and reload the page.'))
      }

      const client = buildClient()

      console.log('graphQuery client', client)

      if (!hasValidCredentials(client)) {
         return reject(maybeAlterErrorMessage('You still need to connect your Shopify store or the credentials are missing. Double check the "connect" tab within the plugin settings.'))
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

      console.log('client', client)

      const [requestError, response] = await to(
         client.graphQLClient.send(
            client.graphQLClient.query(root => {
               resourceQuery(root, type, queryParams, connectionParams)
            })
         )
      )

      if (requestError) {
         return reject(maybeAlterErrorMessage(requestError))
      }

      if (has(response, 'errors')) {
         return reject(maybeAlterErrorMessage(response.errors))
      }

      resolve(response)
   })
}

function resourceQuery(root, type, queryParams, connectionParams = false) {
   switch (type) {
      case 'products':
         productsQuery(root, queryParams)
         break

      case 'collections':
         collectionsQuery(root, queryParams, connectionParams)
         break

      default:
         break
   }
}

function productsQuery(root, queryParams) {
   root.addConnection('products', { args: queryParams }, product => {
      addProductFields(product)
   })
}

function collectionsQuery(root, queryParams, connectionParams = false) {
   root.addConnection('collections', { args: queryParams }, collection => {
      addCollectionFields(collection, connectionParams)
   })
}

function refetchLineItems(ids, client) {
   return new Promise(async (resolve, reject) => {
      var allPromises = ids.map(async id => {
         const [err, succ] = await to(fetchProductByID(id, client))

         if (!err) {
            return succ
         }
         return err
      })

      var [allPromiseError, allPromiseResponse] = await to(Promise.all(allPromises))

      if (allPromiseError) {
         reject(allPromiseError)
      }

      resolve(allPromiseResponse)
   })
}

function isTypeError(data) {
   return data instanceof Error
}

function withoutTypeErrors(results) {
   return results.filter(result => !isTypeError(result))
}

function getProductsFromIds(ids = []) {
   return new Promise(async (resolve, reject) => {
      const client = buildClient()
      const [productsError, products] = await to(fetchProductsByIDs(ids, client))

      /*
      
      If productsError, most likely the product was hidden from the sales channel

      */
      if (productsError) {
         console.error('wpshopify error 💩 ', productsError)

         const [refetchError, results] = await to(refetchLineItems(ids, client))

         if (refetchError) {
            console.error('wpshopify error 💩 ', refetchError)
            return reject(maybeAlterErrorMessage(refetchError))
         }

         resolve(withoutTypeErrors(results))
      }

      resolve(products)
   })
}

function queryProducts(params) {
   return fetchProductsByQuery(params, buildClient())
}

function getAllTags() {
   return fetchAllTags()
}

export { getProductsFromIds, queryProducts, getAllTags, findVariantFromSelectedOptions, graphQuery, refetchQuery }
