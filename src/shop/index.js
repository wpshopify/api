import to from 'await-to-js'
import { getCache } from '../cache'

function maybeFetchShop(client) {
   console.log('maybeFetchShop 1 :: ', client)

   return new Promise(async (resolve, reject) => {
      var value = getCache('wps-shop-' + WP_Shopify.storefront.storefrontAccessToken)

      if (value) {
         console.log('maybeFetchShop value 3', value)
         resolve(value)
      } else {
         console.log('maybeFetchShop 4', value)

         const [fetchError, fetchShop] = await to(fetchShopInfo(client))

         console.log('maybeFetchShop 5', fetchError)
         console.log('maybeFetchShop 6', fetchShop)

         if (fetchError) {
            reject(fetchError)
         }

         resolve(fetchShop)
      }
   })
}

function fetchShopInfo(client) {
   return client.shop.fetchInfo()
}

export { maybeFetchShop }
