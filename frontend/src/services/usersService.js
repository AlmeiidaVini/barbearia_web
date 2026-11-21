import { ApiError, request } from './http'

export async function listUsers(signal) {
  const data = await request('/users?limit=3&select=firstName,lastName,username,email,image', { signal })
  if (!Array.isArray(data?.users)) {
    throw new ApiError('Resposta de usuários inválida.')
  }
  return data.users.slice(0, 3)
}
