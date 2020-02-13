import { post } from '../request'

function endpointComponentPayload() {
  return 'components/payload'
}

function cachePayload(componentPayload, cacheLength) {
  return post(endpointComponentPayload(), {
    data: componentPayload,
    cacheLength: cacheLength
  })
}

export { cachePayload }
