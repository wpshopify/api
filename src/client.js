import Client from 'shopify-buy';
import { noticeConfigBadCredentials } from './notices';

/*

Checks for an active client object. We store this
upon initial bootstrap for ease of use.

*/
function clientActive() {
console.log('WP_Shopify.client ', WP_Shopify.client);
  if ( !WP_Shopify.client ) {
    return false;
  }

  return true;

}

function getClient() {
  return WP_Shopify.client;
}

function setClient(client) {

  WP_Shopify.client = client;

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
  if ( clientActive() ) {
    console.log('Client already cached, returning ...');
    return getClient();
  }

  console.log('Client NOT cached, building ...');

  if (!creds) {
    return noticeConfigBadCredentials();
  }

  // If creds look good, build the Client!
  return setClient( initClient(creds) );

}

export {
  buildClient
}
