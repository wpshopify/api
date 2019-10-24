import { post } from '../request'
import { getCache, setCache } from '../../cache'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import find from 'lodash/find'
import to from 'await-to-js'

function endpointComponentOptions() {
   return 'components/options'
}

function endpointComponentPayload() {
   return 'components/payload'
}

function onlyActiveComponentIds(components) {
   return filter(components, option => !isEmpty(option.componentId)).map(option => option.componentId)
}

function createCacheNameFromIds(componentIds) {
   return componentIds.join('-')
}

// Returns a promise
function getComponentOptionsFromIds(componentOptionIds) {
   return post(endpointComponentOptions(), componentOptionIds)
}

// Returns a promise
function cachePayload(componentPayload) {
   console.log('cachePayload componentPayload', componentPayload)

   return post(endpointComponentPayload(), { data: componentPayload })
}

function findComponentsOfType(componentOptionIds, option) {
   return find(componentOptionIds, { type: Object.keys(option)[0] })
}

function combineComponentIdWithOptions(options, componentOptionIds) {
   return options.map(option => {
      var found = findComponentsOfType(componentOptionIds, option)

      if (found) {
         option.componentOptionId = found.componentOptionIds[0]
      }

      return option
   })
}

function cachedComponentOptions(cacheName) {
   return getCache('wps-component-options-' + cacheName)
}

/*

Gets the component options for our react app

*/
async function getComponentOptions(componentOptions) {
   console.log('getComponentOptions 1')
   const [error, success] = await to(getComponentOptionsFromIds({ data: componentOptions }))

   console.log('getComponentOptions 3')
   if (error) {
      console.error('getComponentOptions :: ', error)
      return Promise.reject(error)
   }

   console.log('getComponentOptions 4 success.datasuccess.data', success.data)
   const finalOptions = combineComponentIdWithOptions(success.data, componentOptions)

   console.log('getComponentOptions 5 finalOptionsfinalOptions', finalOptions)

   console.log('getComponentOptions 6')
   return Promise.resolve(finalOptions)
}

export { getComponentOptions, cachePayload }
