import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

function getStorefrontURI() {
  return 'https://wpstest.myshopify.com/api/graphql'
}

function storefrontHeaders() {
  return {
    'X-Shopify-Storefront-Access-Token': '98ce33c4b7e2d545d8fe9721e1663778',
  }
}

function buildMiddlewareLink() {
  return setContext(() => ({
    headers: storefrontHeaders(),
  }))
}

function buildHttpLink(uri) {
  return createHttpLink({ uri: uri })
}

function buildStorefrontClient() {
  return getStorefrontClient(buildMiddlewareLink(), buildHttpLink(getStorefrontURI()))
}

function getStorefrontClient(middlewareLink, httpLink) {
  return new ApolloClient({
    link: middlewareLink.concat(httpLink),
    cache: new InMemoryCache(),
  })
}

export { buildStorefrontClient }
