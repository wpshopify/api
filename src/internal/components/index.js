import { post } from '../request'
import { getCache, setCache } from '../../cache'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import find from 'lodash/find'
import to from 'await-to-js'
import compact from 'lodash/compact'

function endpointComponentOptions() {
   return 'components/options'
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
   const activeComponentIds = onlyActiveComponentIds(componentOptions)

   const cachedResults = cachedComponentOptions(createCacheNameFromIds(activeComponentIds))

   if (!isEmpty(cachedResults)) {
      return Promise.resolve(cachedResults)
   }

   const [error, success] = await to(getComponentOptionsFromIds({ data: componentOptions }))

   if (error) {
      console.error('getComponentOptions :: ', error)
   }

   const finalOptions = combineComponentIdWithOptions(success.data, componentOptions)

   setCache('wps-component-options-' + createCacheNameFromIds(activeComponentIds), finalOptions)

   return Promise.resolve(success.data)
}

export { getComponentOptions }
