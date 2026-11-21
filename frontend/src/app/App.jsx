import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import ServicosPage from '../pages/ServicosPage'
import AgendamentoPage from '../pages/AgendamentoPage'
import SobrePage from '../pages/SobrePage'
import ContatoPage from '../pages/ContatoPage'
import LoginPage from '../pages/LoginPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/servicos" element={<ServicosPage />} />
        <Route path="/agendamento" element={<AgendamentoPage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}