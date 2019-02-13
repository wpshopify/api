import { getProduct, getProducts, queryProducts } from '../../src/products';
import to from 'await-to-js';


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
  var data = await getProduct('Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzIyMDY4MjY5MjIwMzI=');

  expect(data)
    .toBeTruthy()
    .toBeObject()
    .toContainKeys( productFields() );

});


/*

It should return invalid product id error

*/
it('Should return product availabilty error', async () => {

  try {
    await getProduct('Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzIyMDY4MjY3MjU0MjQ');

  } catch (e) {

    expect(e).toContainObject({
      message: "Variable id of type ID! was provided invalid value"
    });

  }

});


/*

It should return invalid product id error

*/
it('Should return invalid product id error', async () => {

  try {
    await getProduct('1111');

  } catch (e) {

    expect(e).toContainObject({
      message: 'Variable id of type ID! was provided invalid value'
    });

  }

});


/*

It should get multiple products by ids

*/
it('Should return valid products', async () => {

  var productIds = [
    'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzIyMDY4MjY4NTY0OTY=',
    'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzIyMDY4MjY3NTgxOTI='
  ]

  var data = await getProducts(productIds);

  expect(data)
    .toBeTruthy()
    .toBeArray()
    .toBeArrayOfSize(2);

  data.forEach(function(product) {
    expect(product)
      .toBeTruthy()
      .toBeObject()
      .toContainKeys( productFields() );
  });

});



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
    query: "title:Sm*",
    reverse: false
  }


  var result = await queryProducts(params);

  // console.log('result ', result);

  console.log(result.map( product => product.title));

  // expect(result)
  //   .toBeTruthy()
  //   .toBeArray()
  //   .toBeArrayOfSize(2);
  //
  // result.forEach(function(product) {
  //   expect(product)
  //     .toBeTruthy()
  //     .toBeObject()
  //     .toContainKeys( productFields() );
  // });

});






afterAll( async done => {
  done();
});
