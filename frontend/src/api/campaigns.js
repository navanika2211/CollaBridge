import { request } from './client'

const ROUTE = '/api/campaigns'

export function getCampaigns(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${ROUTE}${query ? `?${query}` : ''}`).then(r => r.data)
}

export function getCampaign(id) {
  return request(`${ROUTE}/${id}`).then(r => r.data)
}

export function createCampaign(data) {
  return request(ROUTE, { method: 'POST', body: data }).then(r => r.data)
}

export function updateCampaign(id, data) {
  return request(`${ROUTE}/${id}`, { method: 'PUT', body: data }).then(r => r.data)
}

export function deleteCampaign(id) {
  return request(`${ROUTE}/${id}`, { method: 'DELETE' })
}
