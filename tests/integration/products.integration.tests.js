import { getProduct } from '../../src/products';

it('Should return true', async () => {

  // Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzIyMDY4MTM4MTQ4MzI=
  // comes from the WPS dev store -- never should change
  var data = await getProduct('Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzIyMDY4MTM4MTQ4MzI=');

  expect(data)
    .toBeTruthy()
    .toContain('tes');

});

afterAll( async done => {
  done();
});
