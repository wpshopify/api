import { post } from '../request'
import { getCache, setCache } from '../../cache'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import find from 'lodash/find'
import to from 'await-to-js'

function endpointComponentOptions() {
   return 'components/options'
}

function onlyActiveComponentIds(components) {
   return filter(components, option => !isEmpty(option.componentOptionIds)).map(option => option.componentOptionIds)
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

function hasCachedComponentOptions(componentOptionIds) {
   const activeComponentIds = onlyActiveComponentIds(componentOptionIds)

   console.log('activeComponentIds...........', activeComponentIds)

   const cacheName = createCacheNameFromIds(activeComponentIds)

   const cachedResults = getCache('wps-component-options-' + cacheName)
   console.log('cachedResults ', cachedResults)

   // console.log('cachedResult', cachedResult)

   // if (!cachedResults) {
   //    console.log('Has cached component Ids')
   //    return Promise.resolve(cachedResults)
   // }

   return {
      cachedResults: cachedResults,
      cacheName: cacheName
   }
}

/*

Gets the component options for our react app

*/
async function getComponentOptions(componentOptionHashes = {}) {
   const componentOptionIds = componentOptionHashes.data
   console.log('componentOptionHashes', componentOptionHashes)
   // console.log('componentOptionHashes.data.join()', componentOptionHashes.data.join('-'))

   // const activeComponentIds = onlyActiveComponentIds(componentOptionIds)

   // console.log('activeComponentIds...........', activeComponentIds)

   // var joined = createCacheNameFromIds(activeComponentIds)

   // const cachedResults = getCache('wps-component-options-' + joined)
   // console.log('cachedResults ', cachedResults)

   const { cachedResults, cacheName } = hasCachedComponentOptions(componentOptionIds)

   // console.log('cachedResult', cachedResult)

   if (cachedResults) {
      console.log('Has cached component Ids')
      return Promise.resolve(cachedResults)
   }

   // console.log('zz')

   return new Promise(async (resolve, reject) => {
      const [error, success] = await to(getComponentOptionsFromIds(componentOptionHashes))

      if (error) {
         console.log('error in component option hash request', error)
      }

      console.log('success.data', success.data)

      const options = combineComponentIdWithOptions(success.data, componentOptionIds)

      console.log('okokokokokokokok', options)

      setCache('wps-component-options-' + cacheName, options)

      resolve(options)
   })
}

export { getComponentOptions }
