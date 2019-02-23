const getRestAPINonce = () => WP_Shopify.API.nonce;

const getRestAPIPrefix = () => WP_Shopify.API.restUrl + WP_Shopify.API.namespace + '/';

export {
   getRestAPINonce,
   getRestAPIPrefix
}