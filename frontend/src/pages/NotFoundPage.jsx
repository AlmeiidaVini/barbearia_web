import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

// Página exibida quando a rota não existe.
export default function NotFoundPage() {
  return (
    <>
      <Header showCta={false} />

      <main className="site-page">
        <section className="container">
          <h1>Erro 404</h1>

          <h2>Página não encontrada</h2>

          <p>
            O endereço que você tentou acessar
            não existe ou foi removido.
          </p>

          <Link to="/">
            Voltar para o início
          </Link>
        </section>
      </main>

      <Footer />
    </>
  )
}
