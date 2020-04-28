import isString from 'lodash/isString'
import isError from 'lodash/isError'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import has from 'lodash/has'

function findErrorMessage(maybeErrorMessage) {
  let finalErrorMessage = ''

  if (isString(maybeErrorMessage)) {
    return maybeErrorMessage
  }

  if (isError(maybeErrorMessage)) {
    return maybeErrorMessage.name + ': ' + maybeErrorMessage.message
  }

  if (isArray(maybeErrorMessage)) {
    return maybeErrorMessage[0].message.toString()
  }

  if (isObject(maybeErrorMessage)) {
    if (has(maybeErrorMessage, 'message')) {
      return maybeErrorMessage.message.toString()
    }

    if (has(maybeErrorMessage, 'config')) {
      return 'Missing credentials Client object'
    }
  }

  return maybeErrorMessage.toString()
}

function isWordPressError(response) {
  var foundError = false

  if (isObject(response) && has(response, 'data') && has(response.data, 'type')) {
    if (response.data.type === 'error') {
      foundError = true
    }
  }

  return foundError
}

function maybeAlterErrorMessage(errorMessage) {
  let finalError = ''
  let error = findErrorMessage(errorMessage)

  console.error('WP Shopify Error raw: ', error)

  if (error.includes('TypeError: Failed to fetch')) {
    finalError =
      'Uh oh, it looks like your Shopify credentials are incorrect. Please double check your domain and storefront access token within the plugin settings and try again.'
  } else if (error.includes('Variable ids of type [ID!]! was provided invalid value')) {
    finalError =
      'Uh oh, it appears that invalid product ids were used. Please clear your browser cache and reload the page.'
  } else if (error.includes('Parse error on "}" (RCURLY) at [1, 10]')) {
    finalError =
      'Uh oh, it looks like an error occurred. Please contact the plugin developer with this message to fix.'
  } else if (error.includes('Network Error')) {
    finalError =
      'Uh oh, it looks like a network error occurred. Please ensure that your site is using a valid HTTPS certificate on all pages.'
  } else if (
    error.includes(
      'Variable lineItems of type [CheckoutLineItemInput!]! was provided invalid value'
    )
  ) {
    finalError =
      'Uh oh, it looks like an invalid lineitems data type was found. Please clear your cache and try again.'
  } else if (error.includes('Missing credentials Client object')) {
    finalError =
      'Hmm, it looks like you still need to connect your Shopify store or the credentials are wrong / missing. Please double check the "connect" tab within the plugin settings.'
  } else if (error.includes('Parse error on "}" (RCURLY)')) {
    finalError =
      'Hmm, it looks like you may be trying to access a field on the Storefront API that does not exist.'
  } else {
    finalError = error
  }

  return finalError
}

export { maybeAlterErrorMessage, isWordPressError }
