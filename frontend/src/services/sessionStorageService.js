
const SESSION_KEY = 'barbearia_web_session'

// Salva somente o token e os dados necessários do usuário.
export function saveSession({ accessToken, user }) {
  if (!accessToken || !user) {
    throw new Error('Dados de sessão inválidos.')
  }

  const session = {
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image
    }
  }

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  )
}

// Recupera a sessão salva no navegador.
export function getSession() {
  const savedSession = sessionStorage.getItem(SESSION_KEY)

  if (!savedSession) {
    return null
  }

  try {
    const session = JSON.parse(savedSession)

    if (!session?.accessToken || !session?.user) {
      clearSession()
      return null
    }

    return session
  } catch {
    clearSession()
    return null
  }
}

// Remove a sessão quando o usuário sair.
export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}
