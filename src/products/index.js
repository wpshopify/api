import { buildClient } from '../client'
import has from 'lodash/has'

/*

Direct API functions

*/
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

function fetchAllProducts(client) {
   return client.product.fetchAll()
}

function fetchByCollectionTitle() {
   const result = buildClient().graphQLClient.query(shop => {
      shop.addConnection('collections', { args: { first: 10, query: 'title:Test' } }, collection => {
         collection.addConnection('products', { args: { first: 10, query: 'title:Aerodynamic Aluminum Bottle' } }, product => {
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

            // product.add('images')
            product.addConnection('images', { args: { first: 50 } }, image => {
               image.add('altText')
               image.add('src')
            })
            product.add('options', option => {
               option.add('name')
               option.add('values')
            })

            product.addConnection('variants', variants => {
               variants.add('id')
               variants.add('product')
               variants.add('title')
               variants.add('price')
               variants.add('availableForSale')
               variants.add('compareAtPrice')
               variants.add('selectedOptions')
               variants.add('sku')
               variants.add('weight')
               variants.add('image', image => {
                  image.add('src')
                  image.add('id')
                  image.add('altText')
               })
            })

            // product.addConnection('options',
         })
      })
   })

   return buildClient().graphQLClient.send(result)
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

   product.addConnection('variants', { args: { first: 250 } }, variants => {
      variants.add('id')
      variants.add('product')
      variants.add('title')
      variants.add('price')
      variants.add('availableForSale')

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

function enumValue(client, queryParams) {
   return client.graphQLClient.enum(queryParams.sortKey)
}

/*

queryParams:

{  
   first: 20, 
   sortKey: 'CREATED_AT', 
   reverse: true
}


sortKeys that work:
UPDATED_AT
CREATED_AT
TITLE
BEST_SELLING
PRICE

*/
function graphQuery(type, queryParams) {
   const client = buildClient()

   if (has(queryParams, 'sortKey')) {
      queryParams.sortKey = enumValue(client, queryParams)
   }

   // Defaults to 10
   if (!has(queryParams, 'first') || !has(queryParams, 'last')) {
      queryParams.first = 10
   }

   return client.graphQLClient.send(
      client.graphQLClient.query(shop => {
         resourceQuery(shop, type, queryParams)
      })
   )
}

function resourceQuery(shop, type, queryParams) {
   switch (type) {
      case 'products':
         productsQuery(shop, queryParams)
         break

      default:
         break
   }
}

function formatIdsForQuery(query) {
   return query.map(id => 'id:' + id).join(' OR ')
}

function productsQuery(shop, queryParams) {
   queryParams.query = formatIdsForQuery(queryParams.query)

   shop.addConnection('products', { args: queryParams }, product => {
      addProductFields(product)
   })
}

/*

Convience wrappers

*/
function getProduct(id) {
   return fetchProductByID(id, buildClient())
}

async function getProductsFromIds(ids = []) {
   return fetchProductsByIDs(ids, buildClient())
}

function getAllProducts() {
   return fetchAllProducts(buildClient())
}

function queryProducts(params) {
   return fetchProductsByQuery(params, buildClient())
}

function getAllTags() {
   return fetchAllTags()
}

function getProductsFromQuery(queryParams) {
   return queryProducts(queryParams)
}

export { getProduct, getProductsFromIds, getAllProducts, queryProducts, getProductsFromQuery, getAllTags, findVariantFromSelectedOptions, fetchByCollectionTitle, graphQuery }
