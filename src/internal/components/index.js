import { post } from '../request'
import { getCache, setCache } from '../../cache'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import find from 'lodash/find'

function endpointComponentOptions() {
   return 'components/options'
}

/*

Gets the component options for our react app

*/
async function getComponentOptions(componentOptionHashes = {}) {
   console.log('componentOptionHashes', componentOptionHashes.data)
   // console.log('componentOptionHashes.data.join()', componentOptionHashes.data.join('-'))

   const ok = filter(componentOptionHashes.data, option => !isEmpty(option.componentOptionIds)).map(option => option.componentOptionIds)

   console.log('ok...........', ok)

   var joined = ok.join('-')

   const cachedResults = getCache('wps-component-options-' + joined)
   console.log('cachedResults ', cachedResults)

   // console.log('cachedResult', cachedResult)

   if (cachedResults) {
      console.log('ss')

      return Promise.resolve(cachedResults)
   }
   // console.log('zz')

   return new Promise(async (resolve, reject) => {
      const result = await post(endpointComponentOptions(), componentOptionHashes)
      console.log('result.data', result.data)

      const okdd = result.data.map(option => {
         var found = find(componentOptionHashes.data, { type: Object.keys(option)[0] })
         if (found) {
            option.componentOptionId = found.componentOptionIds[0]
         }

         return option
      })

      console.log('okokokokokokokok', okdd)

      setCache('wps-component-options-' + joined, okdd)

      resolve(okdd)
   })
}

export { getComponentOptions }
