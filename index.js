export { buildClient } from './src/client'
export { buildCheckout, buildInstances, replaceLineItems, updateCheckoutAttributes, getProductsFromLineItems } from './src/checkout'

export { getProductsFromIds, queryProducts, findVariantFromSelectedOptions, graphQuery, refetchQuery } from './src/products'
export { fetchNextPage } from './src/pagination'
export { findLastCursorId, queryBuilder } from './src/api'
export { filterObj, commaToArray } from './src/utils'
export { buildQuery } from './src/api/query'
export { getFilterData } from './src/internal/products'
export { getComponentOptions, cachePayload } from './src/internal/components'
export { turnOffCacheCleared } from './src/internal/tools'
export { maybeAlterErrorMessage, isWordPressError } from './src/errors'
export { setCache, getCache, deleteCache, deleteCacheContains } from './src/cache'
export { getCheckoutCache, setCheckoutCache, mergeCheckoutCacheVariants, mergeCheckoutCacheLineItems } from './src/cache/checkout'

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
   deleteCustomerAddress
} from './src/internal/customers'
