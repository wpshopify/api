import "isomorphic-fetch";
import Client from 'shopify-buy';
import 'jest-extended';
import 'jest-chain';


/*

Taken from: https://medium.com/@andrei.pfeiffer/jest-matching-objects-in-array-50fe2f4d6b98

*/
expect.extend({

  toContainObject(received, argument) {

    const pass = this.equals(received,
      expect.arrayContaining([
        expect.objectContaining(argument)
      ])
    )

    if (pass) {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
        pass: true
      }
    } else {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
        pass: false
      }
    }
  }

})
