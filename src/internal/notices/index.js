import { post } from '../request';

function endpointNotices() {
   return 'notices';
}

function endpointNoticesDismiss() {
   return 'notices/dismiss';
}

function deleteNotices() {
   return post(endpointNotices());
}

function dismissNotices(params) {
   return post(endpointNoticesDismiss(), params);
}

export {
   dismissNotices,
   deleteNotices
}