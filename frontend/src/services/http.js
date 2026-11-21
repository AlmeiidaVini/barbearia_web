import { API_BASE_URL } from '../config/api'

export class ApiError extends Error {
  constructor(message, { status = 0, isNetworkError = false } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.isNetworkError = isNetworkError
  }
}

export async function request(
  path,
  { method = 'GET', body, token, signal } = {}
) {
  const headers = {}

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique sua internet.',
      { isNetworkError: true }
    )
  }

  const text = await response.text()
  let data = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    throw new ApiError(data?.message || `Erro ${response.status}`, {
      status: response.status
    })
  }

  return data
}