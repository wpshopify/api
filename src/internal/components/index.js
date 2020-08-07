import { post } from '../request'

function endpointComponentTemplate() {
  return 'components/template'
}

function getTemplate(templateName) {
  return post(endpointComponentTemplate(), {
    data: templateName,
  })
}

export { getTemplate }
