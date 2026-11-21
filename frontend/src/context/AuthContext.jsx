import { useState, useEffect } from 'react'
import { AuthContext } from './authContextValue'
import { getCurrentUser } from '../services/authService'
import {
  saveSession,
  getSession,
  clearSession
} from '../services/sessionStorageService'

// Disponibiliza a autenticação para toda a aplicação.
export function AuthProvider({ children }) {

  // Guarda os dados do usuário autenticado.
  const [user, setUser] = useState(null)

  // Guarda o token de acesso.
  const [accessToken, setAccessToken] = useState(null)

  // Estados possíveis:
  // loading, authenticated, unauthenticated.
  const [status, setStatus] = useState('loading')

  // Mensagens relacionadas à sessão.
  const [sessionMessage, setSessionMessage] = useState('')

  // Restaura a sessão ao carregar ou atualizar a página.
  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      // Recupera a sessão salva anteriormente.
      const savedSession = getSession()

      // Se não existir sessão, permanece deslogado.
      if (!savedSession) {
        setStatus('unauthenticated')
        return
      }

      try {
        // Consulta a API para verificar o token.
        const currentUser = await getCurrentUser(
          savedSession.accessToken
        )

        // Evita atualizar um componente desmontado.
        if (cancelled) return

        // Token válido: restaura a autenticação.
        setUser(currentUser)
        setAccessToken(savedSession.accessToken)
        setStatus('authenticated')
        setSessionMessage('')

      } catch (error) {
        if (cancelled) return

        // Token inválido, expirado ou sem permissão.
        if (error.status === 401 || error.status === 403) {
          clearSession()

          setUser(null)
          setAccessToken(null)
          setStatus('unauthenticated')
          setSessionMessage(
            'Sessão expirada, entre novamente.'
          )

          return
        }

        // Falha de conexão ou erro temporário:
        // mantém os dados salvos anteriormente.
        setUser(savedSession.user)
        setAccessToken(savedSession.accessToken)
        setStatus('authenticated')
        setSessionMessage(
          'Não foi possível validar a sessão agora. Usando dados salvos.'
        )
      }
    }

    restoreSession()

    // Limpeza do efeito.
    return () => {
      cancelled = true
    }
  }, [])

  // Executada após um login bem-sucedido.
  function login({ user, accessToken }) {
    // Armazena token e dados básicos do usuário.
    saveSession({ user, accessToken })

    // Atualiza os estados do React.
    setUser(user)
    setAccessToken(accessToken)
    setStatus('authenticated')
    setSessionMessage('')
  }

  // Encerra a sessão do usuário.
  function logout() {
    // Remove a sessão armazenada.
    clearSession()

    // Limpa os estados de autenticação.
    setUser(null)
    setAccessToken(null)
    setStatus('unauthenticated')
    setSessionMessage('')
  }

  // Compartilha os dados e funções.
  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        status,
        sessionMessage,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}