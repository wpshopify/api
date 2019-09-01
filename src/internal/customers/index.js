import { post } from '../request'

/*

Customers Endpoints

*/
function endpointCustomers() {
   return 'customers'
}

function endpointCustomersCount() {
   return 'customers/count'
}

function endpointCustomersLogin() {
   return 'customers/login'
}

function endpointCustomersAssociate() {
   return 'customers/associate'
}

function endpointResetPasswordCustomers() {
   return 'customers/reset-password'
}

function endpointSetPasswordCustomer() {
   return 'customers/set-password'
}

function endpointResetPasswordByUrlCustomer() {
   return 'customers/reset-password-by-url'
}

function endpointRegisterCustomer() {
   return 'customers/register'
}

function endpointCustomer() {
   return 'customer'
}

function endpointUpdateCustomerAddress() {
   return 'customers/address/update'
}

function endpointAddCustomerAddress() {
   return 'customers/address/add'
}

function endpointDeleteCustomerAddress() {
   return 'customers/address/delete'
}

/*

Get Smart Collections

Returns: promise

*/
function getCustomers(data = {}) {
   return post(endpointCustomers(), data)
}

function loginCustomer(data = {}) {
   return post(endpointCustomersLogin(), data)
}

function associateCustomer(data = {}) {
   return post(endpointCustomersAssociate(), data)
}

function resetPasswordCustomer(data = {}) {
   return post(endpointResetPasswordCustomers(), data)
}

function setPasswordCustomer(data = {}) {
   return post(endpointSetPasswordCustomer(), data)
}

function resetPasswordByUrlCustomer(data = {}) {
   return post(endpointResetPasswordByUrlCustomer(), data)
}

function registerCustomer(data = {}) {
   return post(endpointRegisterCustomer(), data)
}

function getCustomersCount() {
   return post(endpointCustomersCount())
}

function getCustomer(data = {}) {
   return post(endpointCustomer(), data)
}

function updateCustomerAddress(data = {}) {
   return post(endpointUpdateCustomerAddress(), data)
}

function addCustomerAddress(data = {}) {
   return post(endpointAddCustomerAddress(), data)
}

function deleteCustomerAddress(data = {}) {
   return post(endpointDeleteCustomerAddress(), data)
}

export {
   getCustomersCount,
   getCustomers,
   loginCustomer,
   associateCustomer,
   resetPasswordCustomer,
   setPasswordCustomer,
   resetPasswordByUrlCustomer,
   registerCustomer,
   getCustomer,
   updateCustomerAddress,
   addCustomerAddress,
   deleteCustomerAddress
}
