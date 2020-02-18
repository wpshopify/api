import { buildClient } from '../client'

/*

Direct API functions

*/
function fetchNextPage(payload) {
  console.log('payloadpayloadpayload for next', payload)

  return buildClient().fetchNextPage(payload)
}

export { fetchNextPage }
