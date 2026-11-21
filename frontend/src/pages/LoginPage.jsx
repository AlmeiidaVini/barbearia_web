
import { useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { login } from '../services/authService'
import '../styles/Auth.css'

// Verifica se os campos obrigatórios foram preenchidos
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
  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const [fieldErrors, setFieldErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  // Atualiza os campos conforme o usuário digita
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

  // Valida os dados e solicita autenticação à API
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
      const result = await login({
        username: form.username.trim(),
        password: form.password
      })

      // Temporário: será integrado ao AuthContext do Vinicius
      console.log('Login ok:', result.user)

    } catch (error) {
      setApiError(error.message || 'Erro ao realizar login.')
    } finally {
      setLoading(false)
    }
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

              <label htmlFor="username">Usuário</label>
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

              <label htmlFor="password">Senha</label>
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

              <button type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <div className="auth-demo">
                <strong>Credenciais de demonstração</strong>
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
