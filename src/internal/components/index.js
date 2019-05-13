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

function cachedComponentOptions(componentOptions) {
   const activeComponentIds = onlyActiveComponentIds(componentOptions)

   const cachedResults = compact(activeComponentIds.map(id => getCache('wps-component-options-' + id)))

   return cachedResults

   // console.log('cachedResult', cachedResult)

   // if (!cachedResults) {
   //    console.log('Has cached component Ids')
   //    return Promise.resolve(cachedResults)
   // }

   return {
      cachedResults: cachedResults
   }
}

/*

Gets the component options for our react app

*/
async function getComponentOptions(componentOptions) {
   // const components = componentOptionHashes.data
   // console.log('componentOptionHashesssssssss', componentOptionHashes)
   // console.log('componentOptionHashes.data.join()', componentOptionHashes.data.join('-'))

   // const activeComponentIds = onlyActiveComponentIds(components)

   // console.log('activeComponentIds...........', activeComponentIds)

   // var joined = createCacheNameFromIds(activeComponentIds)

   // const cachedResults = getCache('wps-component-options-' + joined)
   // console.log('cachedResults ', cachedResults)

   const cachedResults = cachedComponentOptions(componentOptions)

   // console.log('cachedResult', cachedResult)

   if (!isEmpty(cachedResults)) {
      return Promise.resolve(cachedResults)
   }

   // console.log('componentOptionHashes', componentOptionHashes)

   const [error, success] = await to(getComponentOptionsFromIds({ data: componentOptions }))

   if (error) {
   }

   // const options = combineComponentIdWithOptions(success.data, components)

   // console.log('okokokokokokokok', options)

   // setCache('wps-component-options-' + cacheName, options)

   return Promise.resolve(success.data)
   // resolve()

   // return new Promise(async (resolve, reject) => {

   // })
}

export { getComponentOptions }
