import { FETCH_CUSTOMER_INFO } from './queries'
import { buildStorefrontClient } from '../client/storefront'

function getCustomer(customerAccessToken) {
   var client = buildStorefrontClient()

   return client.query({
      variables: {
         customerAccessToken: customerAccessToken
      },
      query: FETCH_CUSTOMER_INFO
   })
}

export { getCustomer }
