import {
   get,
   post
} from '../request';

function endpointSyncingStatus() {
   return 'syncing/status';
}

function endpointSyncingStatusPosts() {
   return 'syncing/status/posts';
}

function endpointSyncingStatusWebhooks() {
   return 'syncing/status/webhooks';
}

function endpointSyncingStatusRemoval() {
   return 'syncing/status/removal';
}

function endpointSyncingStop() {
   return 'syncing/stop';
}

function endpointSyncingNotices() {
   return 'syncing/notices';
}

function endpointSyncingIndicator() {
   return 'syncing/indicator';
}

function endpointSyncingCounts() {
   return 'syncing/counts';
}

function endpointSyncingCount() {
   return 'syncing/count';
}


/*

Get syncing status

Returns: promise

*/
function getSyncingStatus() {
   return get(endpointSyncingStatus());
}

function setSyncingIndicator(data = {}) {
   return post(endpointSyncingIndicator(), data);
}

function saveCounts(data = {}) {
   return post(endpointSyncingCounts(), data);
}

export {
   getSyncingStatus,
   setSyncingIndicator,
   saveCounts
}
