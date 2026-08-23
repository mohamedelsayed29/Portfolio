/**
 * Thin fetch wrapper. Point VITE_API_URL at a real backend and every feature's
 * api module starts talking to it; with no env var set the feature modules fall
 * back to their local mock implementations so the UI is fully demoable offline.
 */
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export const isBackendConfigured = Boolean(BASE_URL)

export class ApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export async function request(
  path,
  { method = 'GET', body, headers, signal, baseUrl = BASE_URL } = {},
) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(payload?.message ?? `Request failed with ${response.status}`, {
      status: response.status,
      details: payload?.details,
    })
  }

  return payload
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
}

/** Simulated latency for the mock paths, so loading states are real. */
export const delay = (ms = 700) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
