import { buildClient } from '../client'

/*

Direct API functions

*/
function fetchNextPage(payload) {
   return buildClient().fetchNextPage(payload)
}

export { fetchNextPage }
