import { post, get } from '../request'

function endpointProducts() {
   return 'products'
}

function endpointProductsCount() {
   return 'products/count'
}

function endpointPublishedProductIds() {
   return 'products/ids'
}

function endpointGetAllProductTags() {
   return 'products/tags'
}

function endpointGetAllProductVendors() {
   return 'products/vendors'
}

function endpointGetAllProductTypes() {
   return 'products/types'
}

/*

Gets products

Returns: promise

*/
function getProducts(data = {}) {
   return post(endpointProducts(), data)
}

/*

Gets products count

Returns: promise

*/
function getProductsCount() {
   return post(endpointProductsCount())
}

/*

Gets published product ids

Returns: promise

*/
function getPublishedProductIds() {
   return post(endpointPublishedProductIds())
}

function getAllTags() {
   return get(endpointGetAllProductTags())
}

function getAllVendors() {
   return get(endpointGetAllProductVendors())
}

function getAllTypes() {
   return get(endpointGetAllProductTypes())
}

function getFilterData() {
   return Promise.all([getAllTags(), getAllVendors(), getAllTypes()])
}

export { getProducts, getPublishedProductIds, getAllTags, getFilterData }
