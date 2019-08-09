import localforage from 'localforage'

function maybeFetchShop(client) {
   return new Promise((resolve, reject) => {
      localforage
         .getItem('wps-shop-' + WP_Shopify.storefront.storefrontAccessToken)
         .then(function(value) {
            if (value) {
               resolve(value)
            } else {
               resolve(fetchShopInfo(client))
            }
         })
         .catch(function(err) {
            reject(err)
         })
   })
}

function fetchShopInfo(client) {
   return client.shop.fetchInfo()
}

export { maybeFetchShop }
