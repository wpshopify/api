export { buildClient } from './src/client'
export {
  buildCheckout,
  buildInstances,
  replaceLineItems,
  updateCheckoutAttributes,
  getProductsFromLineItems,
  createUniqueCheckout,
  addLineItemsAPI,
  addDiscount,
  removeDiscount,
} from './src/checkout'

export {
  getProductsFromIds,
  queryProducts,
  findVariantFromSelectedOptions,
  graphQuery,
  refetchQuery,
  enumMake,
  fetchNewItems,
} from './src/products'
export { fetchNextPage } from './src/pagination'
export { maybeFetchShop, getShopCache } from './src/shop'
export { findLastCursorId, queryBuilder } from './src/api'
export {
  filterObj,
  commaToArray,
  sanitizeDomainField,
  encodePayloadSettings,
  decodePayloadSettings,
} from './src/utils'
export { buildQueryStringFromSelections, buildQueryFromSelections } from './src/utils/api'
export { buildQuery } from './src/api/query'
export { getFilterData, getVariantInventoryManagement } from './src/internal/products'
export { getSelectedAndAllCollections } from './src/internal/collections'
export { cachePayload } from './src/internal/components'
export { turnOffCacheCleared } from './src/internal/tools'
export { fetchMaskedConnection } from './src/internal/connection'
export { maybeAlterErrorMessage, isWordPressError } from './src/errors'
export { setCache, getCache, deleteCache, deleteCacheContains } from './src/cache'
export {
  getCheckoutCache,
  setCheckoutCache,
  mergeCheckoutCacheVariants,
  mergeCheckoutCacheLineItems,
} from './src/cache/checkout'

export {
  loginCustomer,
  associateCustomer,
  resetPasswordCustomer,
  setPasswordCustomer,
  resetPasswordByUrlCustomer,
  registerCustomer,
  getCustomer,
  updateCustomerAddress,
  addCustomerAddress,
  deleteCustomerAddress,
} from './src/internal/customers'
