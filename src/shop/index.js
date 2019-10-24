import to from 'await-to-js'
import { getCache, setCache } from '../cache'

function maybeFetchShop(client) {
   return new Promise(async (resolve, reject) => {
      var value = getCache('wps-shop-' + WP_Shopify.storefront.storefrontAccessToken)

      if (value) {
         console.log('Shop is cached ... returning ...')

         return resolve(value)
      }

      console.log('Shop is NOT cached ... getting new ...')
      const [fetchError, fetchShop] = await to(fetchShopInfo(client))

      if (fetchError) {
         return reject(fetchError)
      }

      setCache('wps-shop-' + WP_Shopify.storefront.storefrontAccessToken, fetchShop)

      return resolve(fetchShop)
   })
}

function fetchShopInfo(client) {
   return client.shop.fetchInfo()
}

export { maybeFetchShop }
