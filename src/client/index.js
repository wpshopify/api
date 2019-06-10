import Client from 'shopify-buy';
import to from 'await-to-js';
import { noticeConfigBadCredentials } from '../notices/notices';
import { getCache, setCache } from '../cache';

/*

Checks for an active client object. We store this
upon initial bootstrap for ease of use.

*/
function clientActive(client) {

   if (!client) {
      return false;
   }

   return true;

}

function getClient() {
   return getCache('wps-client');
}

function setClient(client) {

   setCache('wps-client', client);

   return client;

}


function initClient(config) {

   return Client.buildClient({
      domain: config.domain,
      storefrontAccessToken: config.storefrontAccessToken
   });

}

function buildClient() {

   const creds = WP_Shopify.storefront;

   // If client cached, just return it
   if (clientActive(WP_Shopify.client)) {
      console.log('buildClient 4');
      return getClient();
   }

   if (!creds) {
      console.log('buildClient 6');
      return noticeConfigBadCredentials();
   }

   // If creds look good, build the Client!
   const client = initClient(creds);

   setClient(client);

   return client;

}


export {
   buildClient
}
