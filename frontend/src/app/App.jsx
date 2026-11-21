import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import ServicosPage from '../pages/ServicosPage'
import AgendamentoPage from '../pages/AgendamentoPage'
import SobrePage from '../pages/SobrePage'
import ContatoPage from '../pages/ContatoPage'
import LoginPage from '../pages/LoginPage'
import { AuthProvider } from '../context/AuthContext'
import PainelPage from '../pages/PainelPage'
import ProtectedRoute from '../components/ProtectedRoute'
import NotFoundPage from '../pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      {/* Compartilha a autenticação entre todas as páginas */}
      <AuthProvider>
        <Routes>
          {/* Rotas públicas originais da AV1 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/servicos" element={<ServicosPage />} />
          <Route path="/agendamento" element={<AgendamentoPage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/contato" element={<ContatoPage />} />

          {/* Login demonstrativo desenvolvido pela Manu */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* Painel protegido: exige autenticação */}
          <Route
            path="/painel"
            element={
              <ProtectedRoute>
                <PainelPage />
              </ProtectedRoute>
            }
          />

          {/*
            Rota protegida de agendamentos.

            Vinícius: responsável por configurar a rota.
            Gabriel: responsável pela página de gerenciamento.

            Quando Gabriel entregar MeusAgendamentosPage.jsx,
            substituir o conteúdo temporário pelo componente dele.
          */}
          <Route
            path="/meus-agendamentos"
            element={
              <ProtectedRoute>
                <main className="site-page">
                  <section className="container">
                    <h1>Meus Agendamentos</h1>

                    <p>
                      O gerenciamento de agendamentos
                      será implementado pelo Gabriel.
                    </p>
                  </section>
                </main>
              </ProtectedRoute>
            }
          />

          {/* Página exibida quando a rota não existe */}
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
