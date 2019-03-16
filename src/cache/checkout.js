import { getCache, setCache } from './index';
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';
import differenceWith from 'lodash/differenceWith';
import isEmpty from 'lodash/isEmpty';


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

function getUniqueValuesOfKey(array, key) {
   return array.reduce(function (carry, item) {
      if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
      return carry;
   }, []);
}

// Assumption: every item in existingLineItems will be unique 
function mergeCheckoutCacheLineItems(existingLineItems, newLineItems) {

   const hasExistingNewLineItems = differenceWith(newLineItems, existingLineItems, function (array1, array2) {
      return array1.variantId === array2.variantId;
   });

   // Whatever was added is completely new ...
   if (!isEmpty(hasExistingNewLineItems)) {
      return existingLineItems.concat(newLineItems);
   }

   return existingLineItems.map((existingLineItem) => {

      var found = find(newLineItems, function (o) { return o.variantId === existingLineItem.variantId; });

      if (found) {
         existingLineItem.quantity = Number(existingLineItem.quantity) + Number(found.quantity);
      }

      return existingLineItem;

   });

}

export {
   getCheckoutCache,
   setCheckoutCache,
   mergeCheckoutCacheVariants,
   mergeCheckoutCacheLineItems
}