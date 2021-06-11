import { getCache, setCache, deleteCache } from './index';
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

function deleteCheckoutCache(checkoutID) {
  return deleteCache('wps-checkout-cache-' + checkoutID);
}

function mergeCheckoutCacheVariants(existingCache, newVariant) {
  if (!existingCache) {
    var result = newVariant;
  } else {
    var result = existingCache.concat(existingCache, newVariant);
  }
  return uniqBy(result, 'id');
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
function mergeCheckoutCacheLineItems(checkoutCache, newLineItems, lineItemOptions) {
  const hasExistingNewLineItems = differenceWith(
    newLineItems,
    checkoutCache.lineItems,
    function (array1, array2) {
      return array1.variantId === array2.variantId;
    }
  );

  var existingLineItemOptions = checkoutCache.lineItemOptions;

  // Whatever was added is completely new ...
  if (!isEmpty(hasExistingNewLineItems)) {
    var nenwww = newLineItems.map((item) => setCorrectQuantity(item, lineItemOptions));

    if (!checkoutCache || !checkoutCache.lineItems) {
      return nenwww;
    }

    return checkoutCache.lineItems.concat(nenwww);
  }

  return checkoutCache.lineItems.map((existingLineItem) => {
    var foundLineItem = find(newLineItems, function (o) {
      return o.variantId === existingLineItem.variantId;
    });

    if (foundLineItem) {
      foundLineItem.quantity = Number(existingLineItem.quantity) + Number(foundLineItem.quantity);

      return setCorrectQuantity(foundLineItem, lineItemOptions);
    }

    return setCorrectQuantity(existingLineItem, lineItemOptions);
  });
}

export {
  getCheckoutCache,
  setCheckoutCache,
  deleteCheckoutCache,
  mergeCheckoutCacheVariants,
  mergeCheckoutCacheLineItems,
};
