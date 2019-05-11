import { post } from '../request'

function endpointToolsClearCache() {
   return 'cache'
}

function endpointToolsClearAll() {
   return 'clear/all'
}

function endpointToolsClearSynced() {
   return 'clear/synced'
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
