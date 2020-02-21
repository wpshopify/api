import { buildClient } from '../client'

function fetchNextPage(payload) {
  return buildClient().fetchNextPage(payload)
}

export { fetchNextPage }
