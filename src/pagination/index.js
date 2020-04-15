import { buildClient } from '../client'

function fetchNextPage(payload) {

  if (!payload || !payload.length) {
    return new Promise(function (resolve, reject) {
      return reject('No existing payload found')
    })
  }

  return buildClient().fetchNextPage(payload)
}

export { fetchNextPage }
