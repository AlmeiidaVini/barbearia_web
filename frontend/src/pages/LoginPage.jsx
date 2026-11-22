import { useState, useContext } from 'react'
// Navigate redireciona quem já está logado; os outros dois já existiam.
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
// Login pela API DummyJSON — Manu
import { login } from '../services/authService'
// Contexto de autenticação — Vinícius
import { AuthContext } from '../context/authContextValue'
import '../styles/Auth.css'

// Verifica se os campos obrigatórios foram preenchidos.
function validate({ username, password }) {
  const errors = {}

  if (!username.trim()) {
    errors.username = 'Informe o usuário.'
  }

  if (!password) {
    errors.password = 'Informe a senha.'
  }

  return errors
}

export default function LoginPage() {
  // Acessa o contexto de autenticação.
  // sessionMessage traz avisos como "Sessão expirada, entre novamente."
  const {
    login: loginContext,
    status,
    sessionMessage
  } = useContext(AuthContext)

  // Permite navegar entre páginas.
  const navigate = useNavigate()

  // Guarda a página que o usuário queria acessar.
  const location = useLocation()

  // Página para onde a pessoa vai depois de entrar.
  // Se ela tentou abrir uma rota protegida, volta para essa rota;
  // senão, vai para o painel.
  const destino = location.state?.from || '/painel'

  // Armazena os campos do formulário.
  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  // Controla erros e carregamento.
  const [fieldErrors, setFieldErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  // Atualiza os campos conforme o usuário digita.
  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value
    }))

    setFieldErrors((current) => ({
      ...current,
      [name]: ''
    }))

    setApiError('')
  }

  // Valida os dados e realiza a autenticação.
  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validate(form)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setLoading(true)
    setApiError('')

    try {
      // 1. Envia usuário e senha para a API.
      const result = await login({
        username: form.username.trim(),
        password: form.password
      })

      // 2. Salva a autenticação no AuthContext.
      loginContext(result)

      // 3. Redireciona para a página desejada.
      navigate(destino, { replace: true })

    } catch (error) {
      setApiError(
        error.message || 'Erro ao realizar login.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Quem já está logado não precisa ver o formulário.
  // Este "if" fica DEPOIS de todos os hooks (useContext, useNavigate,
  // useLocation e useState), porque o React exige que os hooks sejam
  // chamados sempre na mesma ordem, em toda renderização.
  if (status === 'authenticated') {
    return <Navigate to={destino} replace />
  }

  return (
    <>
      <Header showCta={false} />

      <main className="site-page">
        <section className="auth-section">
          <div className="auth-layout">

            <form
              className="auth-card"
              onSubmit={handleSubmit}
              noValidate
            >
              <h1>Entrar</h1>

              <p className="auth-note">
                Login demonstrativo com usuários fictícios
                da API DummyJSON.
              </p>

              {/* Aviso vindo do AuthContext, por exemplo quando
                  a sessão expirou e a pessoa foi enviada ao login. */}
              {sessionMessage && (
                <p className="auth-info" role="status">
                  {sessionMessage}
                </p>
              )}

              <label htmlFor="username">
                Usuário
              </label>

              <input
                id="username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                aria-invalid={Boolean(fieldErrors.username)}
              />

              {fieldErrors.username && (
                <span className="auth-field-error">
                  {fieldErrors.username}
                </span>
              )}

              <label htmlFor="password">
                Senha
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                aria-invalid={Boolean(fieldErrors.password)}
              />

              {fieldErrors.password && (
                <span className="auth-field-error">
                  {fieldErrors.password}
                </span>
              )}

              {apiError && (
                <p className="auth-error" role="alert">
                  {apiError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || status === 'loading'}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <div className="auth-demo">
                <strong>
                  Credenciais de demonstração
                </strong>
                <span>Usuário: emilys</span>
                <span>Senha: emilyspass</span>
              </div>

            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}