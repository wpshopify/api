function noticeConfigEmptyLineItemsBeforeUpdate() {
  return {
    type: 'warning',
    message: wp.i18n.__(
      'Uh oh, we were unable to locate the product you attempted to update. Please clear your browser cache and try again.',
      'wpshopify'
    ),
  }
}

function noticeConfigBadCredentials() {
  return {
    type: 'error',
    message: wp.i18n.__(
      'Hmm, it looks like you still need to connect your Shopify store or the credentials are wrong / missing. Please double check the "connect" tab within the plugin settings.',
      'wpshopify'
    ),
  }
}

function noticeConfigUnableToBuildCheckout() {
  return {
    type: 'error',
    message: wp.i18n.__(
      'Unable to connect to store. This could be because your network is down or your browser is blocking cookies. A possible <a href="https://wpshop.io/docs" target="_blank">solution can be found here</a>. Try disabling any browser extensions and clearing your browser cache.',
      'wpshopify'
    ),
  }
}

function noticeConfigUnableToFlushCache() {
  return {
    type: 'error',
    message: wp.i18n.__(
      'Unable to flush the store cache. Please clear your browser cache and reload the page.',
      'wpshopify'
    ),
  }
}

function noticeConfigUnableToCreateNewShoppingSession() {
  return {
    type: 'error',
    message: wp.i18n.__(
      'Unable to create new session after checking out. Please clear your browser cache and reload the page.',
      'wpshopify'
    ),
  }
}

export {
  noticeConfigEmptyLineItemsBeforeUpdate,
  noticeConfigBadCredentials,
  noticeConfigUnableToBuildCheckout,
  noticeConfigUnableToFlushCache,
  noticeConfigUnableToCreateNewShoppingSession,
}
