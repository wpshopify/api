import { post } from '../request';


function endpointConnection() {
   return 'connection';
}

function endpointConnectionDelete() {
   return 'connection/delete';
}

function endpointConnectionCheck() {
   return 'connection/check';
}


function checkConnection(params) {
   return post(endpointConnectionCheck(), params);
}


export {
   checkConnection
}