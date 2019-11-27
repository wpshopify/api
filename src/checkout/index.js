import to from "await-to-js"
import isEmpty from "lodash/isEmpty"
import uniq from "lodash/uniq"
import { buildClient } from "../client"
import { getCache, setCache } from "../cache"
import { getProductsFromIds } from "../products"
import { getCheckoutCache } from "../cache/checkout"
import { maybeFetchShop } from "../shop"
import { maybeAlterErrorMessage } from "../errors"

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

function createUniqueCheckout() {
  return createCheckout(buildClient())
}

function updateCheckoutAttributesAPI(
  client,
  checkout,
  customAttributes = false,
  note = false
) {
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
  if (!checkout) {
    return new Promise((resolve, reject) =>
      reject("Error: Missing checkout instance")
    )
  }

  if (!client) {
    return new Promise((resolve, reject) =>
      reject("Error: Missing client instance")
    )
  }

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
  if (has(checkout, "completedAt") && checkout.completedAt) {
    return true
  } else {
    return false
  }
}

function getCheckoutID() {
  return getCache("wps-last-checkout-id")
}

function setCheckoutID(checkoutID) {
  return setCache("wps-last-checkout-id", checkoutID)
}

function emptyCheckoutID(cartID) {
  if (
    cartID === undefined ||
    cartID === "undefined" ||
    cartID == false ||
    cartID == null
  ) {
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
      return reject(getCheckoutError)
    }

    var [newCartError, newCart] = await to(
      addLineItems(client, checkoutID, options)
    )

    if (newCartError) {
      return reject(newCartError)
    }

    return resolve(newCart)
  })
}

function buildInstances(forceNew = false) {
  return new Promise(async function(resolve, reject) {
    const client = buildClient()

    if (!client) {
      return reject(client)
    }

    if (!hasCredsSet(client)) {
      return reject(
        "Oops, it looks like you still need to set your Shopify API credentials. Please add these within the plugin settings and try again."
      )
    }

    const [errors, [checkout, shop]] = await to(
      Promise.all([buildCheckout(client, forceNew), maybeFetchShop(client)])
    )

    if (errors) {
      return reject(errors)
    }

    return resolve({
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

    const [lineItemsError, lineItems] = await to(
      replaceLineItemsAPI(client, checkout, lineItemsNew)
    )

    if (lineItemsError) {
      return reject(maybeAlterErrorMessage(lineItemsError))
    }

    return resolve(lineItems)
  })
}

function updateCheckoutAttributes(attributes) {
  var attributesCopy = attributes

  return new Promise(async function(resolve, reject) {
    var [instancesError, { client, checkout }] = await to(buildInstances())

    if (instancesError) {
      return reject(maybeAlterErrorMessage(instancesError))
    }

    const [checkoutAttrsError, checkoutAttrsResponse] = await to(
      updateCheckoutAttributesAPI(
        client,
        checkout,
        attributesCopy.customAttributes,
        attributesCopy.note
      )
    )

    if (checkoutAttrsError) {
      return reject(maybeAlterErrorMessage(checkoutAttrsError))
    }

    return resolve(checkoutAttrsResponse)
  })
}

function hasCredsSet(client) {
  if (!client) {
    return false
  }

  if (
    isEmpty(client.config.domain) ||
    isEmpty(client.config.storefrontAccessToken)
  ) {
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
        const [checkoutError, checkout] = await to(
          getCheckoutByID(client, existingCheckoutID)
        )

        if (checkout === null) {
          if (!hasCredsSet(client)) {
            return reject(
              "Oops, it looks like you still need to set your Shopify API credentials. Please add these within the plugin settings and try again."
            )
          }

          const [checkoutErrorNew, checkoutNew] = await to(
            createCheckout(client)
          )

          if (checkoutErrorNew) {
            return reject(maybeAlterErrorMessage(checkoutErrorNew))
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
      return reject(
        "Oops, it looks like you still need to set your Shopify API credentials. Please add these within the plugin settings and try again."
      )
    }

    const [checkoutError, checkout] = await to(createCheckout(client))

    if (checkoutError) {
      return reject(maybeAlterErrorMessage(checkoutError))
    } else {
      setCheckoutID(checkout.id)
      return resolve(checkout)
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
  return uniq(variants.map(lineItem => lineItem.product.id))
}

async function getProductsFromLineItems() {
  const uniqueIds = getUniqueProductIdsFromVariants(variantsFromCache())

  if (isEmpty(uniqueIds)) {
    return new Promise(resolve => resolve([]))
  }

  return await getProductsFromIds(uniqueIds)
}

export {
  buildInstances,
  buildCheckout,
  addLineItems,
  replaceLineItems,
  getCheckoutID,
  updateCheckoutAttributes,
  getProductsFromLineItems,
  createUniqueCheckout,
  addLineItemsAPI
}
