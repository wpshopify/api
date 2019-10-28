import Client from 'shopify-buy'
import { noticeConfigBadCredentials } from '../notices/notices'

function initClient(config) {
   return Client.buildClient({
      domain: config.domain,
      storefrontAccessToken: config.storefrontAccessToken
   })
}

function hasSessionStorage() {
   var cached = sessionStorage.getItem('wps-storefront-creds');

   if (cached) {
      return JSON.parse(cached);
   }

   return false;
}
 
function buildClient() {

   var cachedCreds = hasSessionStorage();

   if (cachedCreds) {
      var creds = cachedCreds

   } else {
      var creds = WP_Shopify.storefront // defaults
   }

   if (!creds) {
      return noticeConfigBadCredentials()
   }

   return initClient(creds)
}

export { buildClient }
