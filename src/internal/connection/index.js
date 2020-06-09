import { post } from '../request'

function endpointConnectionMask() {
  return 'connection/mask'
}

function endpointConnectionCheck() {
  return 'connection/check'
}

function checkConnection(params) {
  return post(endpointConnectionCheck(), params)
}

function fetchMaskedConnection(params) {
  return post(endpointConnectionMask(), params)
}

export { checkConnection, fetchMaskedConnection }
