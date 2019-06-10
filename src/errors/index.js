import isString from 'lodash/isString'
import isError from 'lodash/isError'

function findErrorMessage(maybeErrorMessage) {
   console.log('maybeErrorMessage', maybeErrorMessage)

   let finalErrorMessage = ''

   if (isString(maybeErrorMessage)) {
      return maybeErrorMessage
   }

   if (isError(maybeErrorMessage)) {
      console.error('wpshopify error 💩 ', maybeErrorMessage)
      finalErrorMessage = maybeErrorMessage.name + ': ' + maybeErrorMessage.message
   } else {
      console.error('wpshopify error 💩 ', maybeErrorMessage)
      finalErrorMessage = maybeErrorMessage[0].message
   }

   return finalErrorMessage
}

function maybeAlterErrorMessage(errorMessage) {
   let finalError = ''
   let foundErrorMessage = findErrorMessage(errorMessage)

   console.log('foundErrorMessage', foundErrorMessage)

   switch (foundErrorMessage) {
      case 'TypeError: Failed to fetch':
         finalError = 'Uh oh, it looks like your Shopify credentials are incorrect. Please double check your domain and storefront access token within the plugin settings and try again.'
         break

      case 'Variable ids of type [ID!]! was provided invalid value':
         finalError = 'Uh oh, it appears that invalid product ids were used. Please clear your browser cache and reload the page.'
         break

      case 'Parse error on "}" (RCURLY) at [1, 10]':
         finalError = 'Uh oh, it looks like an error occurred. Please contact the plugin developer with this message to fix.'
         break

      default:
         finalError = foundErrorMessage
         break
   }

   return finalError
}

export { maybeAlterErrorMessage }
