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

   const [err, resp] = await to(
      client.query({
         query: gql`
            {
               customers(first: 10) {
                  edges {
                     node {
                        firstName
                        orders(first: 10) {
                           edges {
                              node {
                                 id
                                 discountCode
                              }
                           }
                        }
                     }
                  }
               }
            }
         `
      })
   )

   if (err) {
      console.log('Error! ', err)
   } else {
      console.log('resp', resp)
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
