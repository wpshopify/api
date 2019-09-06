import to from 'await-to-js'
import isEmpty from 'lodash/isEmpty'
import uniq from 'lodash/uniq'
import { buildClient } from '../client'
import { getCache, setCache } from '../cache'
import { getProductsFromIds } from '../products'
import { getCheckoutCache } from '../cache/checkout'
import { maybeFetchShop } from '../shop'
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
   console.log('buildInstances 1')

   return new Promise(async function(resolve, reject) {
      const client = buildClient()

      console.log('buildInstances 2 :: client ', client)

      if (!client) {
         console.log('buildInstances 3')
         return reject(client)
      }

      if (!hasCredsSet(client)) {
         console.log('buildInstances 4')
         return reject('Oops, it looks like you still need to set your Shopify API credentials. Please add these within the plugin settings and try again.')
      }

      const [errors, [checkout, shop]] = await to(Promise.all([buildCheckout(client, forceNew), maybeFetchShop(client)]))

      console.log('buildInstances 5 :: errors ', errors)
      console.log('buildInstances 6 :: checkout ', checkout)
      console.log('buildInstances 7 :: shop ', shop)
      console.log('buildInstances 8 :: forceNew ', forceNew)

      if (errors) {
         return reject(errors)
      }

      console.log('buildInstances 9 :: setCache', 'wps-shop-' + WP_Shopify.storefront.storefrontAccessToken)
      console.log('buildInstances 10 :: setCache SHOP DATA', shop)

      setCache('wps-shop-' + WP_Shopify.storefront.storefrontAccessToken, shop)

      var finalData = {
         client: client,
         checkout: checkout,
         shop: shop
      }

      console.log('buildInstances 11 :: finalData', finalData)

      resolve(finalData)
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

function hasCredsSet(client) {
   if (!client) {
      return false
   }

   if (isEmpty(client.config.domain) || isEmpty(client.config.storefrontAccessToken)) {
      return false
   }

   return true
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

            if (checkout === null) {
               if (!hasCredsSet(client)) {
                  return reject('Oops, it looks like you still need to set your Shopify API credentials. Please add these within the plugin settings and try again.')
               }

               const [checkoutErrorNew, checkoutNew] = await to(createCheckout(client))

               if (checkoutErrorNew) {
                  reject(maybeAlterErrorMessage(checkoutErrorNew))
               } else {
                  setCheckoutID(checkoutNew.id)
                  resolve(checkoutNew)
               }
            }

            if (checkoutError) {
               return reject(maybeAlterErrorMessage(checkoutError))
            } else {
               return resolve(checkout)
            }
         }
      }

      if (!hasCredsSet(client)) {
         return reject('Oops, it looks like you still need to set your Shopify API credentials. Please add these within the plugin settings and try again.')
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
