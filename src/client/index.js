// import Client from 'shopify-buy/index.unoptimized.umd'
// import Client from 'shopify-buy/index.unoptimized.umd'
import Client from 'shopify-buy'
// import Client from '/Users/andrew/www/devil/devilbox-new/data/www/js-buy-sdk/index.es.js'
import { noticeConfigBadCredentials } from '../notices/notices'

// var Client = require('/Users/andrew/www/devil/devilbox-new/data/www/js-buy-sdk/index.unoptimized.umd.js')

function initClient(config) {
  return Client.buildClient({
    domain: config.domain,
    storefrontAccessToken: config.storefrontAccessToken,
  })
}

function buildClient() {
  const creds = wpshopify.settings.connection.storefront

  if (!creds) {
    return noticeConfigBadCredentials()
  }

  return initClient(creds)
}

export { buildClient }
