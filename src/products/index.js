import { buildClient } from '../client';


function fetchProductByID(id, client) {
  return client.product.fetch(id);
}

function fetchProductsByIDs(ids, client) {
  return client.product.fetchMultiple(ids);
}

function getProduct(id) {
  return fetchProductByID(id, buildClient() );
}

function getProducts(ids = []) {
  return fetchProductsByIDs(ids, buildClient() );
}

export {
  getProduct,
  getProducts
}
