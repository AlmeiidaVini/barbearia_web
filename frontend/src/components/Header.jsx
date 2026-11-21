import { useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BarberLogo } from './BarberLogo'
import { Button } from './Button'
import { AuthContext } from '../context/authContextValue'
import '../styles/HeaderAuth.css'

// Links públicos da barbearia.
const navLinks = [
  {
    to: '/',
    label: 'Início',
    end: true
  },
  {
    to: '/servicos',
    label: 'Serviços'
  },
  {
    to: '/sobre',
    label: 'Sobre'
  },
  {
    to: '/contato',
    label: 'Contato'
  }
]

export function Header({ showCta = true }) {
  // Recupera os dados e funções de autenticação.
  const { user, status, logout } = useContext(AuthContext)

  // Permite redirecionar o usuário.
  const navigate = useNavigate()

  // Encerra a sessão e redireciona para o login.
  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="site-header">
      <div className="container header-inner">

        {/* Logo original */}
        <Link to="/" className="brand brand-link">
          <BarberLogo />
          <span>Barbearia Web</span>
        </Link>

        <nav
          className="nav"
          aria-label="Navegação principal"
        >
          {/* Links originais da AV1 */}
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Navegação do usuário autenticado */}
          {status === 'authenticated' && (
            <>
              <span className="header-user">
                Olá, {user?.firstName || user?.username}
              </span>

              <NavLink
                to="/painel"
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                Painel
              </NavLink>

              <button
                type="button"
                className="header-logout"
                onClick={handleLogout}
              >
                Sair
              </button>
            </>
          )}

          {/* Link de login para visitantes */}
          {status === 'unauthenticated' && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              Entrar
            </NavLink>
          )}
        </nav>

        {/* Botão Agendar original da AV1 */}
        {showCta && (
          <Button to="/agendamento" variant="primary">
            Agendar
          </Button>
        )}

      </div>
    </header>
  )
}
