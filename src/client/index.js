import Client from 'shopify-buy';
import { noticeConfigBadCredentials } from '../notices/notices';

function initClient(config) {
  return Client.buildClient(
    wp.hooks.applyFilters('misc.shop.credentials', {
      domain: config.domain,
      storefrontAccessToken: config.storefrontAccessToken,
    })
  );
}

function buildClient() {
  const creds = wpshopify.settings.connection.storefront;

  if (!creds) {
    return noticeConfigBadCredentials();
  }

  return initClient(creds);
}

export { buildClient };
