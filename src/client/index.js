import Client from "shopify-buy"
import { noticeConfigBadCredentials } from "../notices/notices"

function initClient(config) {
  return Client.buildClient({
    domain: config.domain,
    storefrontAccessToken: config.storefrontAccessToken
  })
}

function buildClient() {
  const creds = WP_Shopify.storefront

  if (!creds) {
    return noticeConfigBadCredentials()
  }

  return initClient(creds)
}

export { buildClient }
