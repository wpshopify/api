function noticeConfigEmptyLineItemsBeforeUpdate() {
  return {
    type: 'warning',
    message:
      'Uh oh, we were unable to locate the product you attempted to update. Please clear your browser cache and try again.',
  }
}

function noticeConfigBadCredentials() {
  return {
    type: 'error',
    message:
      'Hmm, it looks like you still need to connect your Shopify store or the credentials are wrong / missing. Please double check the "connect" tab within the plugin settings.',
  }
}

function noticeConfigUnableToBuildCheckout() {
  return {
    type: 'error',
    message:
      'Unable to connect to store. This could be because your network is down or your browser is blocking cookies. A possible <a href="https://wpshop.io/docs" target="_blank">solution can be found here</a>. Try disabling any browser extensions and clearing your browser cache.',
  }
}

function noticeConfigUnableToFlushCache() {
  return {
    type: 'error',
    message:
      'Unable to flush the store cache. Please clear your browser cache and reload the page.',
  }
}

function noticeConfigUnableToCreateNewShoppingSession() {
  return {
    type: 'error',
    message:
      'Unable to create new session after checking out. Please clear your browser cache and reload the page.',
  }
}

export {
  noticeConfigEmptyLineItemsBeforeUpdate,
  noticeConfigBadCredentials,
  noticeConfigUnableToBuildCheckout,
  noticeConfigUnableToFlushCache,
  noticeConfigUnableToCreateNewShoppingSession,
}
