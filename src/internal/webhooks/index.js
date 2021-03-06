import {
   post
} from '../request';


function endpointWebhooks() {
   return 'webhooks';
}

function endpointWebhooksCount() {
   return 'webhooks/count';
}

function endpointWebhooksDelete() {
   return 'webhooks/delete';
}


/*

Get Smart Collections

Returns: promise

*/
function getWebhooks(data = {}) {
   return post(endpointWebhooks(), data);
}


/*

Get Smart Collections Count

Returns: promise

*/
function getWebhooksCount(data = {}) {
   return post(endpointWebhooksCount(), data);
}


/*

Get Smart Collections Count

Returns: promise

*/
function deleteWebhooks(data = {}) {
   return post(endpointWebhooksDelete(), data);
}


/*

Registers Webhooks

*/
function registerWebhooks(data = {}) {
   return post(endpointWebhooks(), data);
}


export {
   getWebhooksCount,
   getWebhooks,
   deleteWebhooks,
   registerWebhooks
}
