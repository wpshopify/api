import { buildClient } from '../client';


function fetchProductByID(id, client) {
  return client.product.fetch(id);
}

function getProduct(id) {
  return fetchProductByID(id, buildClient() );
}

export default getProduct;
