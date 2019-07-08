import to from 'await-to-js'
import isEmpty from 'lodash/isEmpty'
import uniq from 'lodash/uniq'
import { buildClient } from '../client'
import { getCache, setCache } from '../cache'
import { getProductsFromIds } from '../products'
import { getCheckoutCache } from '../cache/checkout'
import { maybeFetchShop } from '../shop'
import { maybeAlterErrorMessage } from '../errors'
import localforage from 'localforage'

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
   let attributes = {}

   if (!isEmpty(customAttributes)) {
      attributes.customAttributes = customAttributes
   }

   if (note) {
      let trimmedNote = note.trim()

      if (!isEmpty(trimmedNote)) {
         attributes.note = trimmedNote
      }
   }

   if (isEmpty(attributes)) {
      return new Promise((resolve, reject) => resolve(checkout))
   }

   return client.checkout.updateAttributes(checkout.id, attributes)
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

      const [errors, [checkout, shop]] = await to(Promise.all([buildCheckout(client, forceNew), maybeFetchShop(client)]))
console.log('checkout :: ', checkout)
console.log('shop :: ', shop)
console.log('errors :: ', errors)
      if (errors) {
         return reject(errors)
      }

      localforage.setItem('wps-shop-' + WP_Shopify.storefront.storefrontAccessToken, shop)

      resolve({
         client: client,
         checkout: checkout,
         shop: shop
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
      console.log('buildCheckout 1')
      if (!forceNew) {
         console.log('buildCheckout 2')
         // Calls LS
         var existingCheckoutID = getCheckoutID()
console.log('buildCheckout 3')
         if (!emptyCheckoutID(existingCheckoutID)) {
            console.log('buildCheckout 4', existingCheckoutID)
            console.log('buildCheckout 4', client)
            const [checkoutError, checkout] = await to(getCheckoutByID(client, existingCheckoutID))
console.log('buildCheckout 5', checkout)

            if (checkout === null) {
               console.log('5 2 STALE CHECKOUT ID, BUILDING A NEW ONE')

               const [checkoutErrorNew, checkoutNew] = await to(createCheckout(client))
               // need to build a new checkout

               if (checkoutErrorNew) {
         console.log('buildCheckout 5 3')
         reject(maybeAlterErrorMessage(checkoutErrorNew))
      } else {
         console.log('buildCheckout 5 4')
         setCheckoutID(checkoutNew.id)
         resolve(checkoutNew)
      }
      
            }

            if (checkoutError) {
               console.log('buildCheckout 6')
               return reject(maybeAlterErrorMessage(checkoutError))
            } else {
               console.log('buildCheckout 7')
               return resolve(checkout)
            }
         }
      }
console.log('buildCheckout 8')
      const [checkoutError, checkout] = await to(createCheckout(client))
console.log('buildCheckout 9')
      if (checkoutError) {
         console.log('buildCheckout 10')
         reject(maybeAlterErrorMessage(checkoutError))
      } else {
         console.log('buildCheckout 11')
         setCheckoutID(checkout.id)
         resolve(checkout)
      }
   })
}

function variantsFromCache() {
   var cache = getCheckoutCache(getCheckoutID())

   if (cache && !isEmpty(cache.variants)) {
      return cache.variants
   }

   return []
}

function getUniqueProductIdsFromVariants(variants) {
   return uniq(variants.map(lineItem => lineItem.productId))
}

async function getProductIdsFromLineItems() {
   const uniqueIds = getUniqueProductIdsFromVariants(variantsFromCache())

   if (isEmpty(uniqueIds)) {
      return new Promise(resolve => resolve([]))
   }

   return await getProductsFromIds(uniqueIds)
}

export { buildInstances, buildCheckout, addLineItems, replaceLineItems, getCheckoutID, updateCheckoutAttributes, getProductIdsFromLineItems }
