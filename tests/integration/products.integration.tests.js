import { getProduct, getProductsFromIds, queryProducts, fetchByCollectionTitle, graphQuery, queryParams } from '../../src/products'
import { fetchNextPage } from '../../src/pagination'
import to from 'await-to-js'

/*

Taken from reference: https://help.shopify.com/en/api/custom-storefronts/storefront-api/reference/object/product

Depends on the return value of the JS SDK

*/
function productFields() {
   return [
      'availableForSale',
      'createdAt',
      'description',
      'descriptionHtml',
      'handle',
      'id',
      'onlineStoreUrl',
      'options',
      'productType',
      'publishedAt',
      'type',
      'title',
      'variants',
      'images',
      'updatedAt',
      'vendor'
   ]
}

/*

It should return valid product

*/
it('Should return valid product', async () => {
   // ID comes from the WPS dev store -- should never change
   var data = await getProduct('Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzIyMDY4MjY5MjIwMzI=')

   expect(data)
      .toBeTruthy()
      .toBeObject()
      .toContainKeys(productFields())
})

/*

It should return invalid product id error

*/
it('Should return product availabilty error', async () => {
   try {
      await getProduct('Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzIyMDY4MjY3MjU0MjQ')
   } catch (e) {
      expect(e).toContainObject({
         message: 'Variable id of type ID! was provided invalid value'
      })
   }
})

/*

It should return invalid product id error

*/
it('Should return invalid product id error', async () => {
   try {
      await getProduct('1111')
   } catch (e) {
      expect(e).toContainObject({
         message: 'Variable id of type ID! was provided invalid value'
      })
   }
})

/*

It should get multiple products by ids

*/
it('Should return valid products', async () => {
   var productIds = ['Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzIyMDY4MjY4NTY0OTY=', 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzIyMDY4MjY3NTgxOTI=']

   var data = await getProductsFromIds(productIds)

   expect(data)
      .toBeTruthy()
      .toBeArray()
      .toBeArrayOfSize(2)

   data.forEach(function(product) {
      expect(product)
         .toBeTruthy()
         .toBeObject()
         .toContainKeys(productFields())
   })
})

/*

Docs on query syntax: https://help.shopify.com/en/api/getting-started/search-syntax

Working queries

title:Enormous OR title:Awesome

title:Lamp

title:Sm*

*/
it('Should return valid products query result', async () => {
   var params = {
      first: 20,
      sortKey: 'PRICE',
      query: 'title:Sm*',
      reverse: false
   }

   var result = await queryProducts(params)

   //console.log(result.map(product => product.title))

   expect(result)
      .toBeTruthy()
      .toBeArray()
      .toBeArrayOfSize(20)
   //
   // result.forEach(function(product) {
   //   expect(product)
   //     .toBeTruthy()
   //     .toBeObject()
   //     .toContainKeys( productFields() );
   // });
})

// it('Should return valid products query result', async () => {
//    // var params = {
//    //    first: 20,
//    //    sortKey: 'PRICE',

//    //    query: 'collection:Test',
//    //    reverse: false
//    // }
//    // var result = await fetchByCollectionTitle()
//    // console.log('result', result)
//    // console.log('# of products found: ', result.model.collections[0].products.length)
//    // console.log('Product title: ', result.model.collections[0].products[0].title)
// })

it('.....', async () => {
   var result = await graphQuery('products', {
      query: [2216921399344],
      sortKey: 'TITLE'
   })

   // console.log('result', result.model.products[0].variants[0].selectedOptions[0].name)

   // console.log('result', result.model.products[1].title)
   // console.log('result', result.model.products[2].title)
   // console.log('result', result.model.products[3].title)

   // result.model.products.map(product => console.log('Product: ', product.title))

   // console.log('result.model.products', result.model.products)

   // const nextPageOfResults = await fetchNextPage(result.model.products)
   // // console.log('nextPageOfResults', nextPageOfResults)

   // console.log('next result 1 title', nextPageOfResults.model[0].title)
   // console.log('next result 2 title', nextPageOfResults.model[1].title)

   // const nextNextPageOfResults = await fetchNextPage(nextPageOfResults.model)

   // console.log('nextNextPageOfResults', nextNextPageOfResults.model.length) // should be zero

   // console.log('# of products found: ', result.model.collections[0].products.length)
   // console.log('Product title: ', result.model.collections[0].products[0].title)
})

afterAll(async done => {
   done()
})
