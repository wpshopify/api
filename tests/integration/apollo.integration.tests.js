import ApolloClient from 'apollo-client'
import { gql } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import to from 'await-to-js'

/*

It should get multiple products by ids

*/
it('Should do stuff', async () => {
   // var data = await getProductsFromIds(productIds)
   // expect(true).toBeTruthy()

   const httpLink = createHttpLink({ uri: 'https://wpstest.myshopify.com/api/graphql' })

   const middlewareLink = setContext(() => ({
      headers: {
         'X-Shopify-Storefront-Access-Token': '98ce33c4b7e2d545d8fe9721e1663778'
      }
   }))

   const client = new ApolloClient({
      link: middlewareLink.concat(httpLink),
      cache: new InMemoryCache()
   })

   var input = {
      email: 'vuvafo@provmail.net',
      password: '12345'
   }

   var customerAccessToken = '698753c7337ed105d44b77a7bf557b11'

   const ACCESS_TOKEN_GENERATION = gql`
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
         customerAccessTokenCreate(input: $input) {
            userErrors {
               field
               message
            }
            customerAccessToken {
               accessToken
               expiresAt
            }
         }
      }
   `

   const FETCH_CUSTOMER_INFO = gql`
      query($customerAccessToken: String!) {
         customer(customerAccessToken: $customerAccessToken) {
            acceptsMarketing
            createdAt
            defaultAddress {
               address1
            }
            displayName
            email
            firstName
            id
            lastIncompleteCheckout {
               completedAt
            }
            lastName
            phone
            tags
            updatedAt
         }
      }
   `

   const [err, resp] = await to(
      client.query({
         variables: {
            customerAccessToken: customerAccessToken
         },
         query: FETCH_CUSTOMER_INFO
      })
   )

   if (err) {
   } else {
   }

   // expect(data)
   //    .toBeTruthy()
   //    .toBeArray()
   //    .toBeArrayOfSize(2)

   // data.forEach(function(product) {
   //    expect(product)
   //       .toBeTruthy()
   //       .toBeObject()
   //       .toContainKeys(productFields())
   // })
})

afterAll(async done => {
   done()
})
