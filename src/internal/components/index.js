import { post } from '../request'
import { getCache, setCache } from '../../cache'

function endpointComponentOptions() {
   return 'components/options'
}

/*

Get Smart Collections

Returns: promise

*/
async function getComponentOptions(componentOptionsIds = {}) {
   // const cachedResult = getCache('wps-component-options-' + componentOptionsIds.data.join('-'))

   // console.log('cachedResult', cachedResult)

   // if (cachedResult) {
   //    console.log('ss')

   //    return Promise.resolve(cachedResult)
   // }
   // console.log('zz')

   // console.log('componentOptionsIds .....', componentOptionsIds)

   return new Promise(async (resolve, reject) => {
      const result = await post(endpointComponentOptions(), componentOptionsIds)
      // setCache('wps-component-options-' + componentOptionsIds.data.join('-'), result.data)

      resolve(result.data)
   })
}

export { getComponentOptions }
