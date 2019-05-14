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
   // console.log('componentOptionHashesssssssss', componentOptionHashes)
   // console.log('componentOptionHashes.data.join()', componentOptionHashes.data.join('-'))

   const activeComponentIds = onlyActiveComponentIds(componentOptions)

   console.log('activeComponentIds...........', activeComponentIds)

   // const cachedResults = getCache('wps-component-options-' + joined)
   // console.log('cachedResults ', cachedResults)

   const cachedResults = cachedComponentOptions(createCacheNameFromIds(activeComponentIds))

   console.log('cachedResults', cachedResults)
   console.log('componentOptions', componentOptions)

   if (!isEmpty(cachedResults)) {
      console.log('Cache found! Returning it!')
      return Promise.resolve(cachedResults)
   }
   console.log('right befoe')
   const [error, success] = await to(getComponentOptionsFromIds({ data: componentOptions }))
   console.log('success', success)
   console.log('error', error)

   if (error) {
      console.log('getComponentOptionsFromIds error', error)
   }

   const finalOptions = combineComponentIdWithOptions(success.data, componentOptions)

   console.log('okokokokokokokok about to cache this', finalOptions)
   console.log('createCacheNameFromIds(activeComponentIds)', createCacheNameFromIds(activeComponentIds))

   setCache('wps-component-options-' + createCacheNameFromIds(activeComponentIds), finalOptions)

   return Promise.resolve(success.data)
   // resolve()

   // return new Promise(async (resolve, reject) => {

   // })
}

export { getComponentOptions }
