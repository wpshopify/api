import {
   get,
   post
} from '../request';


function endpointLicense() {
   return 'license';
}

function endpointLicenseDelete() {
   return 'license/delete';
}


/*

Get License Key Info

Returns: promise

*/
function getLicense(data = {}) {
   return get(endpointLicense(), data);
}


/*

Set License Key Info

Returns: promise

*/
function setLicense(data = {}) {
   return post(endpointLicense(), data);
}


/*

Set License Key Info

Returns: promise

*/
function deleteLicense(data = {}) {
   return post(endpointLicenseDelete(), data);
}


export {
   getLicense,
   setLicense,
   deleteLicense
}
