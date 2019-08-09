import { buildClient } from '../client'

function fetchCollectionWithProductsById(collectionId) {
   return buildClient().collection.fetchWithProducts(collectionId)
}
