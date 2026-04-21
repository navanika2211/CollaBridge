import { request } from './client'

const ROUTE = '/api/auth'

export function registerUser(data) {
  return request(`${ROUTE}/register`, { method: 'POST', body: data })
}

export function loginUser(data) {
  return request(`${ROUTE}/login`, { method: 'POST', body: data })
}

