const BASE_URL = import.meta.env.VITE_API_URL

if (!BASE_URL) {
  throw new Error('VITE_API_URL is not defined. Add it to your .env file.')
}

export async function request(path, options = {}) {
  const token = localStorage.getItem('cb_token')
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message)
  return json
}
