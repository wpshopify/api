import axios from 'axios';

import {
   getRestAPINonce,
   getRestAPIPrefix
} from './state';


/*

Generic GET method for communicating with the WP Shopify REST API

endpoint - string representing the API enpoint

*/
function get(endpoint) {
   return request('get', getRestAPIPrefix() + endpoint);
}


/*

Generic POST method for communicating with the WP Shopify REST API

endpoint - string representing the API enpoint
data - the POST data object

*/
function post(endpoint, data = {}) {
   return request('post', getRestAPIPrefix() + endpoint, data);
}


function getHeaders() {

   return {
      'X-WP-Nonce': getRestAPINonce()
   }

}


function getRestErrorContents(error) {

   return {
      statusCode: error.status,
      message: error.data.message,
      action_name: error.data.code
   }

}

/*

Main request function

*/
function request(method, endpoint, data = {}) {

   return new Promise((resolve, reject) => {

      axios({
         method: method,
         url: endpoint,
         data: data,
         headers: getHeaders()
      })
         .then(response => resolve(response))
         .catch(error => reject(getRestErrorContents(error.response)));

   });

}


export {
   get,
   post
}
