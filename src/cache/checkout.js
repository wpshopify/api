import { getCache, setCache } from './index';
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';

/*

Checkout Cache structure:

 checkoutCache: {
   lineItems: [{variantId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yOTEwNjAyMjc5Mg==', quantity: 5}],
   variants: [
      {GraphQL object},
      {GraphQL object},
      {GraphQL object},
   ]
}

*/

function getCheckoutCache(checkoutID) {
   return getCache('wps-checkout-cache-' + checkoutID);
}

function setCheckoutCache(checkoutID, checkoutCache) {
   return setCache('wps-checkout-cache-' + checkoutID, checkoutCache);
}

/*

lineItems: [{GraphQL object}, {GraphQL object}]
newVariant: {GraphQL object}

*/
function mergeCheckoutCacheVariants(existingCache, newVariant) {
   return uniqBy(existingCache.concat(existingCache, newVariant), 'id');
}

function mergeCheckoutCacheLineItems(existingLineItems, newLineItem) {

   console.log('...................... existingLineItems', existingLineItems);
   console.log('...................... newLineItem', newLineItem);

   if (!find(existingLineItems, { variantId: newLineItem.variantId })) {
      existingLineItems.push(newLineItem);
      console.log('existingLineItems', existingLineItems);

      return existingLineItems;
   }

   return existingLineItems.map(existingLineItem => {

      if (existingLineItem.variantId === newLineItem.variantId) {
         existingLineItem.quantity = existingLineItem.quantity + newLineItem.quantity;

      } else {

      }

      return existingLineItem;

   });

   //return uniqBy(existingLineItems.concat(existingLineItems, newLineItem), 'id');

}

export {
   getCheckoutCache,
   setCheckoutCache,
   mergeCheckoutCacheVariants,
   mergeCheckoutCacheLineItems
}