import { get, post } from '../request'

function endpointSmartCollections() {
  return 'smart_collections'
}

function endpointSmartCollectionsCount() {
  return 'smart_collections/count'
}

function endpointCustomCollections() {
  return 'custom_collections'
}

function endpointCustomCollectionsCount() {
  return 'custom_collections/count'
}

function endpointAllCollections() {
  return 'collections'
}

function endpointSettingSelectedCollections() {
  return 'settings/selected_collections'
}

/*

Get Custom Collections

Returns: promise

*/
function getCustomCollections(data = {}) {
  return post(endpointCustomCollections(), data)
}

/*

Get Smart Collections Count

Returns: promise

*/
function getSmartCollectionsCount() {
  return post(endpointSmartCollectionsCount())
}

/*

Get Smart Collections Count

Returns: promise

*/
function getCustomCollectionsCount() {
  return post(endpointCustomCollectionsCount())
}

/*

Get Smart Collections Count

Returns: promise

*/
function getAllCollections() {
  return post(endpointAllCollections())
}

function getSelectedCollections() {
  return get(endpointSettingSelectedCollections())
}

function getSelectedAndAllCollections() {
  return Promise.all([getAllCollections(), getSelectedCollections()])
}

export {
  getSmartCollectionsCount,
  getCustomCollectionsCount,
  getCustomCollections,
  getAllCollections,
  getSelectedCollections,
  getSelectedAndAllCollections
}
