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

/*

Get Smart Collections Count

Returns: promise

*/
function getCustomersCount() {
   return post(endpointCustomersCount())
}

export { getCustomersCount, getCustomers, loginCustomer, associateCustomer, resetPasswordCustomer, setPasswordCustomer, resetPasswordByUrlCustomer, registerCustomer }
