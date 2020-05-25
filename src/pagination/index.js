import has from 'lodash/has'
import { buildClient } from '../client'
import { hasCredsSet } from '../checkout'

function fetchNextPage(payload) {
  if (!payload || !payload.length) {
    return new Promise(function (resolve, reject) {
      return reject(wp.i18n.__('No existing payload found', 'wpshopify'))
    })
  }

  const client = buildClient()

  if ((has(client, 'type') && client.type === 'error') || !hasCredsSet(client)) {
    return new Promise(function (resolve, reject) {
      return reject(maybeAlterErrorMessage(client))
    })
  }

  return client.fetchNextPage(payload)
}

export { fetchNextPage }
