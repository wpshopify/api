import { post } from "../request"
import { getCache, setCache } from "../../cache"
import isEmpty from "lodash/isEmpty"
import filter from "lodash/filter"
import find from "lodash/find"
import compact from "lodash/compact"
import to from "await-to-js"

function endpointComponentOptions() {
  return "components/options"
}

function endpointComponentPayload() {
  return "components/payload"
}

function onlyActiveComponentIds(components) {
  return filter(components, option => !isEmpty(option.componentId)).map(
    option => option.componentId
  )
}

function createCacheNameFromIds(componentIds) {
  return componentIds.join("-")
}

// Returns a promise
function getComponentOptionsFromIds(componentOptionIds) {
  return post(endpointComponentOptions(), componentOptionIds)
}

// Returns a promise
function cachePayload(componentPayload, cacheLength) {
  return post(endpointComponentPayload(), {
    data: componentPayload,
    cacheLength: cacheLength
  })
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
  return getCache("wps-component-options-" + cacheName)
}

/*

Gets the component options for our react app

*/
async function getComponentOptions(componentOptions) {
  console.log("componentOptions", componentOptions)

  const [error, success] = await to(
    getComponentOptionsFromIds({ data: componentOptions })
  )

  if (error) {
    console.error("getComponentOptions :: ", error)
    return Promise.reject(error)
  }

  var responseWithoutFalsey = compact(success.data)
  console.log("responseWithoutFalsey", responseWithoutFalsey)

  if (isEmpty(responseWithoutFalsey)) {
    return Promise.reject("Empty component options!")
  }

  const finalOptions = combineComponentIdWithOptions(
    responseWithoutFalsey,
    componentOptions
  )

  return Promise.resolve(finalOptions)
}

export { getComponentOptions, cachePayload }
