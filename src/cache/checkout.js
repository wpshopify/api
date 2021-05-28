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

function setCorrectQuantity(lineItem, lineItemOptions) {
  if (lineItemOptions.minQuantity) {
    if (lineItem.quantity < lineItemOptions.minQuantity) {
      lineItem.quantity = lineItemOptions.minQuantity;
    }
  }

  if (lineItemOptions.maxQuantity) {
    if (lineItem.quantity > lineItemOptions.maxQuantity) {
      lineItem.quantity = lineItemOptions.maxQuantity;
    }
  }

  return lineItem;
}

// Assumption: every item in existingLineItems will be unique
function mergeCheckoutCacheLineItems(existingLineItems, newLineItems, lineItemOptions) {
  console.log('mergeCheckoutCacheLineItems 1');

  const hasExistingNewLineItems = differenceWith(
    newLineItems,
    existingLineItems,
    function (array1, array2) {
      return array1.variantId === array2.variantId;
    }
  );
  console.log('mergeCheckoutCacheLineItems 2', hasExistingNewLineItems);
  // Whatever was added is completely new ...
  if (!isEmpty(hasExistingNewLineItems)) {
    console.log('newLineItems', newLineItems);

    var nenwww = newLineItems.map((item) => setCorrectQuantity(item, lineItemOptions));

    console.log('nenwww', nenwww);

    let lineItemsUpdated = existingLineItems.concat(nenwww);
    console.log('........... lineItemsUpdated', lineItemsUpdated);

    return lineItemsUpdated;
  }
  console.log('mergeCheckoutCacheLineItems 3');
  return existingLineItems.map((existingLineItem) => {
    var foundLineItem = find(newLineItems, function (o) {
      return o.variantId === existingLineItem.variantId;
    });

    if (foundLineItem) {
      console.log('sup', lineItemOptions);

      foundLineItem.quantity = Number(existingLineItem.quantity) + Number(foundLineItem.quantity);

      console.log('??????foundLineItem', foundLineItem);

      var aspdaoskd = setCorrectQuantity(foundLineItem, lineItemOptions);

      console.log('aspdaoskd', aspdaoskd);

      return aspdaoskd;
    }
    console.log('mergeCheckoutCacheLineItems 4');
    return setCorrectQuantity(existingLineItem, lineItemOptions);
  });
}

export {
  getCheckoutCache,
  setCheckoutCache,
  mergeCheckoutCacheVariants,
  mergeCheckoutCacheLineItems,
};
