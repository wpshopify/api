import to from 'await-to-js'
import { getCache, setCache } from '../cache'

function maybeFetchShop(client) {
  return new Promise(async (resolve, reject) => {
    var value = getCache(
      'wps-shop-' + wpshopify.settings.connection.storefront.storefrontAccessToken
    )

    if (value) {
      return resolve(value)
    }

    const [fetchError, fetchShop] = await to(fetchShopInfo(client))

    if (fetchError) {
      return reject(maybeAlterErrorMessage(fetchError))
    }

    setCache(
      'wps-shop-' + wpshopify.settings.connection.storefront.storefrontAccessToken,
      fetchShop
    )

    return resolve(fetchShop)
  })
}

function fetchShopInfo(client) {
  return client.shop.fetchInfo()
}

export { maybeFetchShop }
