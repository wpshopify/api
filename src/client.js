import Client from 'shopify-buy';

function init(config) {

  return Client.buildClient({
    domain: config.domain,
    storefrontAccessToken: config.storefrontAccessToken
  });

}

export {
  init
}
