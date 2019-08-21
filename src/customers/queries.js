import { gql } from 'apollo-boost'

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
         orders(first: 1) {
            edges {
               node {
                  statusUrl
               }
            }
         }
      }
   }
`
export { FETCH_CUSTOMER_INFO }
