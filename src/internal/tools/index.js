import { post } from '../request'

function endpointToolsClearCache() {
   return 'cache'
}

function endpointTurnOffCacheCleared() {
   return 'cache/toggle'
}

/*

Gets published product ids

Returns: promise

*/
function clearCache() {
   return post(endpointToolsClearCache())
}

function turnOffCacheCleared() {
   return post(endpointTurnOffCacheCleared())
}

export { clearCache, turnOffCacheCleared }
