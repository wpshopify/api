import { buildClient } from '../client';
import to from 'await-to-js';
import { getCache } from '../cache';


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

function addLineItems(client, checkoutID, options) {
   return client.checkout.addLineItems(checkoutID, options);
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


/*

Fetch Cart
Returns: Promise

*/
function buildCheckout(client) {

   // Calls LS
   var existingCheckoutID = getCheckoutID();
   console.log('existingCheckoutID ', existingCheckoutID);

   if (!emptyCheckoutID(existingCheckoutID)) {
      console.log('Checkout is cached, returning ...');

      return getCheckoutByID(client, existingCheckoutID);
   }

   console.log('Checkout is NOT cached, building ...');
   return createCheckout(client);

}

export {
   buildCheckout
}