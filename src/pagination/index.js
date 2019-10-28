import { buildClient } from '../client'

/*

Direct API functions

*/
function fetchNextPage(payload) {
   console.log('fetchNextPage payload', payload)

   return buildClient().fetchNextPage(payload)
}

export { fetchNextPage }
