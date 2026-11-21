import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/authContextValue'

// Página inicial da área autenticada.
export default function PainelPage() {
  // Recupera os dados do usuário através do contexto.
  const { user } = useContext(AuthContext)

  return (
    <main>
      <h1>Painel da Barbearia</h1>

      {/* Exibe o nome do usuário autenticado. */}
      <p>
        Bem-vindo, {user?.firstName || user?.username}!
      </p>

      <p>
        Você está acessando a área interna demonstrativa.
      </p>

      <section>
        <h2>Usuários</h2>
        {/* Gabriel implementará a listagem remota aqui. */}
        <p>A listagem de usuários será adicionada em breve.</p>
      </section>

      <Link to="/">Voltar para o início</Link>
    </main>
  )
}
