import { buildClient } from '../client'

function fetchShopInfo(client) {
   return client.shop.fetchInfo()
}

function getShopInfo() {
   return fetchShopInfo(buildClient())
}

export { getShopInfo, fetchShopInfo }
