import identity from 'lodash/identity'
import pickBy from 'lodash/pickBy'
import isString from 'lodash/isString'
import map from 'lodash/map'

function filterObj(obj) {
   return pickBy(obj, identity)
}

function commaToArray(string) {
   if (isString(string) && !string.includes(',')) {
      return [string.trim()]
   }

   return map(string.split(','), val => val.trim())
}

export { filterObj, commaToArray }
