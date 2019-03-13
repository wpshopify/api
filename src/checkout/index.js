import { buildClient } from '../client';
import to from 'await-to-js';
import { getCache, setCache } from '../cache';


/*

Direct API functions

*/
function createCheckout(client) {
   return client.checkout.create();
}

function getCheckoutByID(client, existingCheckoutID) {
   return client.checkout.fetch(existingCheckoutID);
}

function updateLineItems(client, checkout, lineItemsToUpdate) {
   return client.checkout.updateLineItems(checkout.id, lineItemsToUpdate);
}

function removeAllLineItems(client, checkout) {
   return client.checkout.removeLineItems(checkout.id, checkout.lineItems);
}

function addCheckoutAttributes(client, checkout, data) {
   return client.checkout.updateAttributes(checkout.id, { customAttributes: data });
}


function addLineItemsAPI(client, checkout, lineItems) {
   return client.checkout.addLineItems(checkout.id, lineItems);
}










/*

Convience wrappers

*/



/*

Checks if the checkout was completed by the user. Used to create a fresh checkout if needed.

*/
function checkoutCompleted(checkout) {

   if (has(checkout, 'completedAt') && checkout.completedAt) {
      return true;

   } else {
      return false;
   }

}


function getCheckoutID() {
   return getCache('wps-last-checkout-id');
}

function setCheckoutID(checkoutID) {
   return setCache('wps-last-checkout-id', checkoutID);
}

function emptyCheckoutID(cartID) {

   if (cartID === undefined || cartID === 'undefined' || cartID == false || cartID == null) {
      return true;

   } else {
      return false;
   }

}


/*

Create Line Items From Variants

*/
function createLineItemsFromVariants(options, client) {

   return new Promise(async function (resolve, reject) {

      var [getCheckoutError, checkoutID] = await to(getCheckoutID(client));

      if (getCheckoutError) {
         reject(getCheckoutError);
      }

      var [newCartError, newCart] = await to(addLineItems(client, checkoutID, options));

      if (newCartError) {
         reject(newCartError);
      }

      resolve(newCart);

   });

}


function buildInstances() {

   return new Promise(async function (resolve, reject) {

      const client = buildClient();

      if (!client) {
         reject(client);
      }

      const [checkoutError, checkout] = await to(buildCheckout(client));

      if (checkoutError) {
         console.error('checkoutError', checkoutError);
         reject(checkoutError);
      }

      resolve({
         client: client,
         checkout: checkout
      });

   });


}


async function addLineItems(lineItems) {

   var [instancesError, { client, checkout }] = await to(buildInstances());

   console.log('client ', client);
   console.log('checkout ', checkout);

   if (instancesError) {
      return new Promise((resolve, reject) => reject(instancesError));
   }

   return addLineItemsAPI(client, checkout, lineItems);

}



/*

Fetch Cart
Returns: Promise

*/
function buildCheckout(client) {

   return new Promise(async (resolve, reject) => {

      // Calls LS
      var existingCheckoutID = getCheckoutID();

      if (!emptyCheckoutID(existingCheckoutID)) {
         return resolve(getCheckoutByID(client, existingCheckoutID));
      }

      const [checkoutError, checkout] = await to(createCheckout(client));

      if (checkoutError) {
         reject(checkoutError);
      }

      setCheckoutID(checkout.id);

      resolve(checkout);

   });

}

export {
   buildInstances,
   buildCheckout,
   addLineItems
}