import { request } from './client'

const ROUTE = '/api/collaborations'

export function getCollaborations(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${ROUTE}${query ? `?${query}` : ''}`).then(r => r.data)
}

export function getCollaboration(id) {
  return request(`${ROUTE}/${id}`).then(r => r.data)
}

export function createCollaboration(data) {
  return request(ROUTE, { method: 'POST', body: data }).then(r => r.data)
}

export function updateCollaboration(id, data) {
  return request(`${ROUTE}/${id}`, { method: 'PUT', body: data }).then(r => r.data)
}

export function deleteCollaboration(id) {
  return request(`${ROUTE}/${id}`, { method: 'DELETE' })
}
