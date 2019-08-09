import { post } from '../request'

function endpointSmartCollections() {
   return 'smart_collections'
}

function endpointSmartCollectionsCount() {
   return 'smart_collections/count'
}

function endpointCustomCollections() {
   return 'custom_collections'
}

function endpointCustomCollectionsCount() {
   return 'custom_collections/count'
}

function endpointAllCollections() {
   return 'collections'
}

/*

Get Custom Collections

Returns: promise

*/
function getCustomCollections(data = {}) {
   return post(endpointCustomCollections(), data)
}

/*

Get Smart Collections Count

Returns: promise

*/
function getSmartCollectionsCount() {
   return post(endpointSmartCollectionsCount())
}

/*

Get Smart Collections Count

Returns: promise

*/
function getCustomCollectionsCount() {
   return post(endpointCustomCollectionsCount())
}

/*

Get Smart Collections Count

Returns: promise

*/
function getAllCollections() {
   return post(endpointAllCollections())
}

export { getSmartCollectionsCount, getCustomCollectionsCount, getCustomCollections, getAllCollections }
