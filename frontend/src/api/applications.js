import { request } from './client'

const ROUTE = '/api/applications'

export function getApplications(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${ROUTE}${query ? `?${query}` : ''}`).then((r) => r.data)
}

export function createApplication(data) {
  return request(ROUTE, { method: 'POST', body: data }).then((r) => r.data)
}

export function updateApplication(id, data) {
  return request(`${ROUTE}/${id}`, { method: 'PUT', body: data }).then(
    (r) => r.data
  )
}

export function deleteApplication(id) {
  return request(`${ROUTE}/${id}`, { method: 'DELETE' })
}
