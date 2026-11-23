import { useContext, useEffect, useEffectEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContextValue'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { listUsers } from '../services/usersService'
import { usersFallback } from '../data/usersFallback'
import '../styles/Panel.css'

export default function PainelPage() {
  const { user, sessionMessage, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [result, setResult] = useState({ status: 'loading', users: [] })
  const [attempt, setAttempt] = useState(0)

  const handleUnauthorized = useEffectEvent(() => {
    logout()
    navigate('/login', { replace: true })
  })

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      setResult({ status: 'fallback', users: usersFallback.users })
      controller.abort()
    }, 10000)

    listUsers(controller.signal)
      .then((results) => {
        if (controller.signal.aborted) return
        setResult({ status: results.length ? 'ready' : 'empty', users: results })
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        if (error.status === 401) {
          handleUnauthorized()
          return
        }
        if (error.status === 403) {
          setResult({ status: 'forbidden', users: [] })
          return
        }
        setResult({ status: 'fallback', users: usersFallback.users })
      })
      .finally(() => clearTimeout(timeout))
    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [attempt])

  function retry() {
    setResult({ status: 'loading', users: [] })
    setAttempt((previous) => previous + 1)
  }

  return (
    <>
      <Header />
      <main className="container panel-page">
        <div className="panel-heading">
          <div>
            <h1>Painel da Barbearia</h1>
            <p>Bem-vindo, {user?.firstName || user?.username}!</p>
          </div>
          <Link className="panel-action" to="/meus-agendamentos">Meus agendamentos</Link>
        </div>
        {sessionMessage && <p role="status" className="panel-notice">{sessionMessage}</p>}
        <section className="panel-people" aria-labelledby="users-heading">
          <h2 id="users-heading">Pessoas</h2>
          {result.status === 'loading' && <LoadingState>Carregando usuários…</LoadingState>}
          {(result.status === 'ready' || result.status === 'empty') && (
            <p className="panel-source">Dados remotos — DummyJSON (usuários fictícios, não são clientes da barbearia)</p>
          )}
          {result.status === 'empty' && <EmptyState>Nenhum usuário encontrado.</EmptyState>}
          {result.status === 'forbidden' && (
            <ErrorState onRetry={retry}>A API negou o acesso à lista de usuários (403).</ErrorState>
          )}
          {result.status === 'fallback' && (
            <>
              <p className="panel-source">Dados de contingência (simulados)</p>
              <ErrorState onRetry={retry}>API indisponível.</ErrorState>
            </>
          )}
          {result.users.length > 0 && (
            <ul className="panel-users">
              {result.users.map((item) => {
                const { firstName = '', lastName = '' } = item
                return (
                  <li key={item.id}>
                    <span className="panel-avatar" aria-hidden="true">
                      {firstName?.[0] || ''}{lastName?.[0] || ''}
                      {item.image && (
                        <img src={item.image} alt="" width="28" height="28" onError={(event) => {
                          event.currentTarget.hidden = true
                        }} />
                      )}
                    </span>
                    <div>
                      <strong>{[firstName, lastName].filter(Boolean).join(' ')}</strong>
                      <small className="panel-username">@{item.username}</small>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
