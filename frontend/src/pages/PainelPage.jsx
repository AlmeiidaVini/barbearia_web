import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  const { user, sessionMessage } = useContext(AuthContext)
  const [result, setResult] = useState({ status: 'loading', users: [] })
  const [attempt, setAttempt] = useState(0)

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
        if (error.status === 401 || error.status === 403) {
          setResult({ status: 'error', code: error.status, users: [] })
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
          {result.status === 'empty' && <EmptyState>Nenhum usuário encontrado.</EmptyState>}
          {result.status === 'error' && (
            <ErrorState onRetry={retry}>
              {result.code === 401
                ? 'A API exige autenticação (401). Entre novamente para continuar.'
                : 'A API negou o acesso à lista de usuários (403).'}
            </ErrorState>
          )}
          {result.status === 'fallback' && (
            <ErrorState onRetry={retry}>API indisponível. Exibindo dados de contingência.</ErrorState>
          )}
          {result.users.length > 0 && (
            <ul className="panel-users">
              {result.users.map((item, index) => {
                const { firstName, lastName } = usersFallback.users[index]
                return (
                  <li key={item.id}>
                    <span className="panel-avatar" aria-hidden="true">
                      {firstName[0]}{lastName[0]}
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
