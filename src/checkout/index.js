import to from 'await-to-js'
import isEmpty from 'lodash/isEmpty'
import uniq from 'lodash/uniq'
import has from 'lodash/has'
import { buildClient } from '../client'
import { getCache, setCache } from '../cache'
import { getProductsFromIds } from '../products'
import { getCheckoutCache } from '../cache/checkout'
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

function createUniqueCheckout(client = buildClient()) {
  if (isEmpty(client)) {
    return new Promise((resolve, reject) => {
      reject('Invalid client instance found')
    })
  }

  return new Promise(async (resolve, reject) => {
    var [err, resp] = await to(createCheckout(client))

    if (err) {
      reject(maybeAlterErrorMessage(err))
      return
    }

    resolve(resp)
  })
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
  if (!checkout) {
    return new Promise((resolve, reject) => reject('Error: Missing checkout instance'))
  }

  if (!client) {
    return new Promise((resolve, reject) => reject('Error: Missing client instance'))
  }

  return client.checkout.addLineItems(checkout.id, lineItems)
}

function replaceLineItemsAPI(client, checkout, lineItems) {
  return client.checkout.replaceLineItems(checkout.id, lineItems)
}

function addDiscountAPI(client, checkout, discountCode) {
  return client.checkout.addDiscount(checkout.id, discountCode)
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
  return new Promise(async function (resolve, reject) {
    var [getCheckoutError, checkoutID] = await to(getCheckoutID(client))

    if (getCheckoutError) {
      return reject(maybeAlterErrorMessage(getCheckoutError))
    }

    var [newCartError, newCart] = await to(addLineItems(client, checkoutID, options))

    if (newCartError) {
      return reject(maybeAlterErrorMessage(newCartError))
    }

    return resolve(newCart)
  })
}

function buildInstances(forceNew = false) {
  return new Promise(async function (resolve, reject) {
    const client = buildClient()

    if ((has(client, 'type') && client.type === 'error') || !hasCredsSet(client)) {
      return reject(maybeAlterErrorMessage(client))
    }

    const [errors, checkout] = await to(buildCheckout(client, forceNew))

    if (errors) {
      return reject(maybeAlterErrorMessage(errors))
    }

    return resolve({
      client: client,
      checkout: checkout,
    })
  })
}

async function addLineItems(lineItems) {
  var [instancesError, { client, checkout }] = await to(buildInstances())

  if (instancesError) {
    return new Promise((resolve, reject) => reject(maybeAlterErrorMessage(instancesError)))
  }

  return addLineItemsAPI(client, checkout, lineItems)
}

function replaceLineItems(lineItems) {
  var lineItemsNew = lineItems

  return new Promise(async (resolve, reject) => {
    var [instancesError, { client, checkout }] = await to(buildInstances())

    if (instancesError) {
      return reject(maybeAlterErrorMessage(instancesError))
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

function addDiscount(discountCode, existingCheckout = false) {
  return new Promise(async (resolve, reject) => {
    if (!existingCheckout) {
      var [instancesError, { client, checkout }] = await to(buildInstances())
    } else {
      var [instancesError, { client }] = await to(buildInstances())
      var checkout = existingCheckout
    }

    if (instancesError) {
      return reject(maybeAlterErrorMessage(instancesError))
    }

    const [lineItemsError, lineItems] = await to(addDiscountAPI(client, checkout, discountCode))

    if (lineItemsError) {
      return reject(maybeAlterErrorMessage(lineItemsError))
    }

    return resolve(lineItems)
  })
}

function updateCheckoutAttributes(attributes, existingCheckout = false) {
  var attributesCopy = attributes

  return new Promise(async function (resolve, reject) {
    if (!existingCheckout) {
      var [instancesError, { client, checkout }] = await to(buildInstances())
    } else {
      var [instancesError, { client }] = await to(buildInstances())
      var checkout = existingCheckout
    }

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

  if (isEmpty(client.config.domain) || isEmpty(client.config.storefrontAccessToken)) {
    return false
  }

  return true
}

function buildCheckout(client, forceNew = false) {
  console.log('buildCheckout 1')
  return new Promise(async (resolve, reject) => {
    console.log('buildCheckout 2')
    if (!hasCredsSet(client)) {
      console.log('buildCheckout 3')
      return reject(
        'Oops, it looks like you still need to set your Shopify API credentials. Please add these within the plugin settings and try again.'
      )
    }

    if (forceNew) {
      const [checkoutError, checkout] = await to(createCheckout(client))
      console.log('buildCheckout 7')

      if (checkoutError) {
        console.log('buildCheckout 8')
        return reject(maybeAlterErrorMessage(checkoutError))
      } else {
        console.log('buildCheckout 9')
        setCheckoutID(checkout.id)
        return resolve(checkout)
      }
    }

    console.log('buildCheckout 4')
    const existingCheckoutID = getCheckoutID()
    console.log('buildCheckout 5')
    if (emptyCheckoutID(existingCheckoutID)) {
      console.log('buildCheckout 6')
      const [checkoutError, checkout] = await to(createCheckout(client))
      console.log('buildCheckout 7')
      if (checkoutError) {
        console.log('buildCheckout 8')
        return reject(maybeAlterErrorMessage(checkoutError))
      } else {
        console.log('buildCheckout 9')
        setCheckoutID(checkout.id)
        return resolve(checkout)
      }
    }

    console.log('buildCheckout 10')
    const [checkoutError, checkout] = await to(getCheckoutByID(client, existingCheckoutID))
    console.log('buildCheckout 11')
    if (checkoutError) {
      console.log('buildCheckout 12')
      return reject(maybeAlterErrorMessage(checkoutError))
    }
    console.log('buildCheckout 13')
    if (checkout === null) {
      console.log('buildCheckout 14')
      if (!hasCredsSet(client)) {
        console.log('buildCheckout 15')
        return reject(
          'Oops, it looks like you still need to set your Shopify API credentials. Please add these within the plugin settings and try again.'
        )
      }
      console.log('buildCheckout 16')
      const [checkoutErrorNew, checkoutNew] = await to(createCheckout(client))
      console.log('buildCheckout 17')
      if (checkoutErrorNew) {
        console.log('buildCheckout 18')
        return reject(maybeAlterErrorMessage(checkoutErrorNew))
      } else {
        console.log('buildCheckout 19')
        setCheckoutID(checkoutNew.id)
        resolve(checkoutNew)
      }
    }
    console.log('buildCheckout 20')
    if (checkoutError) {
      console.log('buildCheckout 21')
      return reject(maybeAlterErrorMessage(checkoutError))
    } else {
      console.log('buildCheckout 22')
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
  return uniq(variants.map((lineItem) => lineItem.product.id))
}

async function getProductsFromLineItems() {
  const uniqueIds = getUniqueProductIdsFromVariants(variantsFromCache())

  if (isEmpty(uniqueIds)) {
    return new Promise((resolve) => resolve([]))
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
  addLineItemsAPI,
  addDiscount,
  hasCredsSet,
}
