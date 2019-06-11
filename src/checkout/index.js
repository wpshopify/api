import { buildClient } from '../client'
import to from 'await-to-js'
import { getCache, setCache } from '../cache'
import { fetchShopInfo } from '../shop'
import { maybeAlterErrorMessage } from '../errors'

/*

Direct API functions

*/
function createCheckout(client) {
   return client.checkout.create()
}

function getCheckoutByID(client, existingCheckoutID) {
   return client.checkout.fetch(existingCheckoutID)
}

function updateLineItems(client, checkout, lineItemsToUpdate) {
   return client.checkout.updateLineItems(checkout.id, lineItemsToUpdate)
}

function removeAllLineItems(client, checkout) {
   return client.checkout.removeLineItems(checkout.id, checkout.lineItems)
}

function updateCheckoutAttributesAPI(client, checkout, customAttributes = false, note = false) {
   console.log('ddddddddddddddddd', {
      customAttributes: customAttributes,
      note: note
   })

   return client.checkout.updateAttributes(checkout.id, {
      customAttributes: customAttributes,
      note: note
   })
}

function addLineItemsAPI(client, checkout, lineItems) {
   return client.checkout.addLineItems(checkout.id, lineItems)
}

function replaceLineItemsAPI(client, checkout, lineItems) {
   return client.checkout.replaceLineItems(checkout.id, lineItems)
}

/*

Convience wrappers

*/

/*

Checks if the checkout was completed by the user. Used to create a fresh checkout if needed.

*/
function checkoutCompleted(checkout) {
   if (has(checkout, 'completedAt') && checkout.completedAt) {
      return true
   } else {
      return false
   }
}

function getCheckoutID() {
   return getCache('wps-last-checkout-id')
}

function setCheckoutID(checkoutID) {
   return setCache('wps-last-checkout-id', checkoutID)
}

function emptyCheckoutID(cartID) {
   if (cartID === undefined || cartID === 'undefined' || cartID == false || cartID == null) {
      return true
   } else {
      return false
   }
}

/*

Create Line Items From Variants

*/
function createLineItemsFromVariants(options, client) {
   return new Promise(async function(resolve, reject) {
      var [getCheckoutError, checkoutID] = await to(getCheckoutID(client))

      if (getCheckoutError) {
         reject(getCheckoutError)
      }

      var [newCartError, newCart] = await to(addLineItems(client, checkoutID, options))

      if (newCartError) {
         reject(newCartError)
      }

      resolve(newCart)
   })
}

function buildInstances(forceNew = false) {
   return new Promise(async function(resolve, reject) {
      const client = buildClient()

      if (!client) {
         reject(client)
      }

      const [errors, data] = await to(Promise.all([buildCheckout(client, forceNew), fetchShopInfo(client)]))

      if (errors) {
         return reject(errors)
      }

      resolve({
         client: client,
         checkout: data[0],
         shop: data[1]
      })
   })
}

async function addLineItems(lineItems) {
   var [instancesError, { client, checkout }] = await to(buildInstances())

   if (instancesError) {
      return new Promise((resolve, reject) => reject(instancesError))
   }

   return addLineItemsAPI(client, checkout, lineItems)
}

function replaceLineItems(lineItems) {
   var lineItemsNew = lineItems

   return new Promise(async (resolve, reject) => {
      var [instancesError, { client, checkout }] = await to(buildInstances())

      if (instancesError) {
         return reject(instancesError)
      }

      const [lineItemsError, lineItems] = await to(replaceLineItemsAPI(client, checkout, lineItemsNew))

      if (lineItemsError) {
         return reject(maybeAlterErrorMessage(lineItemsError))
      }

      resolve(lineItems)
   })
}

function updateCheckoutAttributes(attributes) {
   var attributesCopy = attributes

   return new Promise(async function(resolve, reject) {
      var [instancesError, { client, checkout }] = await to(buildInstances())

      if (instancesError) {
         return reject(maybeAlterErrorMessage(instancesError))
      }

      const [checkoutAttrsError, checkoutAttrsResponse] = await to(updateCheckoutAttributesAPI(client, checkout, attributesCopy.customAttributes, attributesCopy.note))

      if (checkoutAttrsError) {
         return reject(maybeAlterErrorMessage(checkoutAttrsError))
      }

      resolve(checkoutAttrsResponse)
   })
}

/*

Fetch Cart
Returns: Promise

*/
function buildCheckout(client, forceNew = false) {
   return new Promise(async (resolve, reject) => {
      if (!forceNew) {
         // Calls LS
         var existingCheckoutID = getCheckoutID()

         if (!emptyCheckoutID(existingCheckoutID)) {
            const [checkoutError, checkout] = await to(getCheckoutByID(client, existingCheckoutID))

            if (checkoutError) {
               return reject(maybeAlterErrorMessage(checkoutError))
            } else {
               return resolve(checkout)
            }
         }
      }

      const [checkoutError, checkout] = await to(createCheckout(client))

      if (checkoutError) {
         reject(maybeAlterErrorMessage(checkoutError))
      } else {
         setCheckoutID(checkout.id)
         resolve(checkout)
      }
   })
}

export { buildInstances, buildCheckout, addLineItems, replaceLineItems, getCheckoutID, updateCheckoutAttributes }
