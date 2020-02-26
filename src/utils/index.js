import identity from 'lodash/identity'
import pickBy from 'lodash/pickBy'
import isString from 'lodash/isString'
import map from 'lodash/map'

function filterObj(obj) {
  return pickBy(obj, identity)
}

function commaToArray(string) {
  if (isString(string) && !string.includes(',')) {
    return [string.trim()]
  }

  return map(string.split(','), val => val.trim())
}

function sanitizeDomainField(domain) {
  // Clear protocol from input field if user mistakenly enters ...
  if (containsProtocol(domain) || containsPathAfterShopifyDomain(domain)) {
    return cleanDomainURL(domain)
  }

  return domain
}

function containsProtocol(url) {
  if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) {
    return true
  } else {
    return false
  }
}

function containsPathAfterShopifyDomain(domain) {
  if (domain.indexOf('myshopify.com')) {
    var domainSplit = domain.split('myshopify.com')

    if (domainSplit.length > 1) {
      return true
    }
  } else {
    return false
  }
}

function cleanDomainURL(string) {
  var newString = string

  if (newString.indexOf('http://') > -1) {
    newString = newString.replace('http://', '')
  }

  if (newString.indexOf('http://www.') > -1) {
    newString = newString.replace('http://www.', '')
  }

  if (newString.indexOf('https://www.') > -1) {
    newString = newString.replace('https://www.', '')
  }

  if (newString.indexOf('https://') > -1) {
    newString = newString.replace('https://', '')
  }

  if (newString.indexOf('myshopify.com/') > -1) {
    newString = newString.split('myshopify.com/')
    newString = newString[0] + 'myshopify.com'
  }

  return newString
}

function encodePayloadSettings(payloadSettings) {
  return btoa(JSON.stringify(payloadSettings))
}

function decodePayloadSettings(payloadSettingsId) {
  return JSON.parse(atob(payloadSettingsId))
}

export {
  filterObj,
  commaToArray,
  sanitizeDomainField,
  encodePayloadSettings,
  decodePayloadSettings
}
