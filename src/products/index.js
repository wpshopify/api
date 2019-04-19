import { buildClient } from '../client'

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
      shop.addConnection('collections', { args: { first: 100, query: 'title:Test*' } }, collection => {
         console.log('collection', collection)

         collection.addConnection('products', { args: { first: 100 } }, product => {
            console.log('product', product)

            product.add('title')
         })
      })
   })

   return buildClient().graphQLClient.send(result)
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

export { getProduct, getProductsFromIds, getAllProducts, queryProducts, getProductsFromQuery, getAllTags, findVariantFromSelectedOptions, fetchByCollectionTitle }
