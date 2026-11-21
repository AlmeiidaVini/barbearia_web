import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/authContextValue'

// Protege páginas que exigem autenticação.
export default function ProtectedRoute({ children }) {
  // Recupera o status de autenticação.
  const { status } = useContext(AuthContext)

  // Guarda a página que o usuário tentou acessar.
  const location = useLocation()

  // Aguarda a validação da sessão.
  if (status === 'loading') {
    return <p role="status">Verificando sua sessão...</p>
  }

  // Se não estiver autenticado, redireciona para o login.
  if (status !== 'authenticated') {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  // Usuário autenticado: libera a página.
  return children
}
