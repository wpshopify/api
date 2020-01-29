import isEmpty from 'lodash/isEmpty'
import mapKeys from 'lodash/mapKeys'
import compact from 'lodash/compact'
import isString from 'lodash/isString'
import has from 'lodash/has'

function normalizeKeysForShopifyQuery(selections) {
  return mapKeys(selections, (value, key) => {
    if (key === 'tags') {
      return 'tag'
    }

    if (key === 'vendors') {
      return 'vendor'
    }

    if (key === 'types') {
      return 'product_type'
    }

    if (key === 'titles') {
      return 'title'
    }

    return key
  })
}

function joinFilteredValues(value) {
  if (isEmpty(value)) {
    return ''
  }

  if (isString(value)) {
    return value
  }

  return value.join(' ')
}

function stringifyFilterTypes(filterTypes) {
  if (!filterTypes) {
    return ''
  }

  var joinedTypes = filterTypes.map(joinFilteredValues)

  if (isEmpty(joinedTypes)) {
    return ''
  }

  return joinedTypes.join(' ')
}

function combineFilterTypes(selections, filterTypes, connectiveValue) {
  return compact(
    filterTypes.map((filterType, index) => {
      if (filterType === 'available_for_sale') {
        return
      }

      if (isEmpty(selections[filterType])) {
        return
      }

      if (isString(selections[filterType])) {
        return filterType + ':' + '"' + selections[filterType] + '"'
      } else {
        return selections[filterType].map(function(value, i, arr) {
          if (arr.length - 1 !== i) {
            var connective = ' ' + connectiveValue.toUpperCase()
          } else {
            var connective = ''
          }

          return filterType + ':' + '"' + value + '"' + connective
        })
      }
    })
  )
}

function buildQueryFromSelections(options) {
  var selections = {}

  selections.titles = options.title
  selections.tags = options.tag
  selections.vendors = options.vendor
  selections.types = options.productType
  selections.available_for_sale = options.availableForSale

  return buildQueryStringFromSelections(selections, options.connective)
}

function buildQueryStringFromSelections(selections, connective) {
  if (isEmpty(selections)) {
    return '*'
  }

  const normalizedSelects = normalizeKeysForShopifyQuery(selections)

  let newQuery = stringifyFilterTypes(
    combineFilterTypes(normalizedSelects, Object.keys(normalizedSelects), connective)
  )

  if (has(normalizedSelects, 'available_for_sale')) {
    if (!selections.available_for_sale) {
      newQuery += ' available_for_sale:false'
    } else {
      if (selections.available_for_sale[0] === true) {
        newQuery += ' available_for_sale:true'
      }
    }
  }

  if (newQuery === '') {
    newQuery = '*'
  }

  return newQuery
}

export { buildQueryStringFromSelections, buildQueryFromSelections }
