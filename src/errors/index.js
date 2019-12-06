import isString from "lodash/isString"
import isError from "lodash/isError"
import isArray from "lodash/isArray"
import isObject from "lodash/isObject"
import has from "lodash/has"

function findErrorMessage(maybeErrorMessage) {
  let finalErrorMessage = ""

  if (isString(maybeErrorMessage)) {
    return maybeErrorMessage
  }

  if (isError(maybeErrorMessage)) {
    console.error("wpshopify 1 error 💩 ", maybeErrorMessage)
    return maybeErrorMessage.name + ": " + maybeErrorMessage.message
  } else {
    console.error("wpshopify 2 error 💩 ", maybeErrorMessage)

    if (isArray(maybeErrorMessage)) {
      return maybeErrorMessage[0].message
    } else {
      return maybeErrorMessage.message
    }
  }
}

function isWordPressError(response) {
  var foundError = false

  if (
    isObject(response) &&
    has(response, "data") &&
    has(response.data, "type")
  ) {
    if (response.data.type === "error") {
      foundError = true
    }
  }

  return foundError
}

function maybeAlterErrorMessage(errorMessage) {
  let finalError = ""
  let foundErrorMessage = findErrorMessage(errorMessage)

  switch (foundErrorMessage) {
    case "TypeError: Failed to fetch":
      finalError =
        "Uh oh, it looks like your Shopify credentials are incorrect. Please double check your domain and storefront access token within the plugin settings and try again."
      break

    case "Variable ids of type [ID!]! was provided invalid value":
      finalError =
        "Uh oh, it appears that invalid product ids were used. Please clear your browser cache and reload the page."
      break

    case 'Parse error on "}" (RCURLY) at [1, 10]':
      finalError =
        "Uh oh, it looks like an error occurred. Please contact the plugin developer with this message to fix."
      break

    case "Network Error":
      finalError =
        "Uh oh, it looks like a network error occurred. Please ensure that your site is using a valid HTTPS certificate on all pages."
      break

    default:
      finalError = foundErrorMessage
      break
  }

  return finalError
}

export { maybeAlterErrorMessage, isWordPressError }
