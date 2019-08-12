import isBoolean from 'lodash/isBoolean'
import isArray from 'lodash/isArray'
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'
import { filterObj } from '../utils'

function getProductsFilterParamsFromShortcode(attrs) {
   return attrs
   return {
      availableForSale: has(attrs, 'availableForSale') ? attrs.availableForSale : 'any',
      createdAt: has(attrs, 'createdAt') ? attrs.createdAt : false,
      productType: has(attrs, 'productType') ? attrs.productType : false,
      tag: has(attrs, 'tag') ? attrs.tag : false,
      title: has(attrs, 'title') ? attrs.title : false,
      updatedAt: has(attrs, 'updatedAt') ? attrs.updatedAt : false,
      variantsPrice: has(attrs, 'variantsPrice') ? attrs.variantsPrice : false,
      vendor: has(attrs, 'vendor') ? attrs.vendor : false
   }
}

/* 

Adds boolean to query

*/
function addBooleanToQuery(key, val) {
   if (isBoolean(val)) {
      var bool_converted = val ? 'true' : 'false'
   } else {
      var bool_converted = val
   }

   return key + ':' + bool_converted
}

/*

Defaults to a phrase query which surrounds each term in double quotes

*/
function addStringToQuery(key, val) {
   return key + ':' + '"' + val + '"'
}

function queryChecks(key, val, query) {
   if (isBoolean(val) || val === 'true' || val === 'false') {
      query += addBooleanToQuery(key, val)
   } else {
      query += addStringToQuery(key, val)
   }

   return query
}

function getLastKey(obj) {
   var keys = Object.keys(obj)
   return keys[keys.length - 1]
}

function addNestedQuery(key, values, allAttrs) {
   var query = ''
   var lastKey = getLastKey(values)
   var mainKey = key

   for (var key in values) {
      query = queryChecks(mainKey, values[key], query)

      if (values[key] !== values[lastKey]) {
         query += ' ' + getConnective(allAttrs) + ' '
      }
   }

   return query
}

function getConnective(attrs) {
   return attrs.connective.toUpperCase()
}

function buildQuery(allAttrs) {
   var query = ''
   var filterParams = getProductsFilterParamsFromShortcode(allAttrs)
   var validFilterParams = filterObj(filterParams)

   if (isEmpty(validFilterParams)) {
      return '*' // Returns the default query instead
   }

   var lastKey = getLastKey(validFilterParams)

   for (var key in validFilterParams) {
      if (isArray(validFilterParams[key])) {
         query += addNestedQuery(key, validFilterParams[key], allAttrs)
      } else {
         query = queryChecks(key, validFilterParams[key], query)
      }

      if (validFilterParams[key] !== validFilterParams[lastKey]) {
         query += ' ' + getConnective(allAttrs) + ' '
      }
   }

   return query
}

export { buildQuery }
