import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EditBookingForm from '../components/EditBookingForm'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { cancelBooking, getBookings } from '../services/bookingsService'
import { formatCurrency, isCancelled } from '../utils/bookingUtils'
import '../styles/Panel.css'

export default function MeusAgendamentosPage() {
  const [bookings, setBookings] = useState(getBookings)
  const [confirmation, setConfirmation] = useState(null)
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const reload = () => setBookings(getBookings())
    window.addEventListener('storage', reload)
    return () => window.removeEventListener('storage', reload)
  }, [])

  function handleCancel(id) {
    setError('')
    setMessage('')
    try {
      cancelBooking(id)
      setBookings(getBookings())
      setConfirmation(null)
      setMessage('Agendamento cancelado. O horário foi liberado.')
    } catch {
      setBookings(getBookings())
      setConfirmation(null)
      setError('Não foi possível cancelar o agendamento. Confira a lista e tente novamente.')
    }
  }

  const orderedBookings = bookings.filter((item) => item.id != null).sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
  )
  const bookingToEdit = bookings.find((item) => item.id === editing && !isCancelled(item))

  return (
    <>
      <Header showCta={false} />
      <main className="container panel-page">
        <Link to="/painel">← Voltar ao painel</Link>
        <div className="panel-heading">
          <div>
            <h1>Meus agendamentos</h1>
            <p>Os dados dos agendamentos ficam salvos apenas neste navegador.</p>
          </div>
          <Link className="panel-action" to="/agendamento">Novo agendamento</Link>
        </div>
        {message && <p role="status" className="panel-notice">{message}</p>}
        {error && <p role="alert" className="panel-notice">{error}</p>}
        {orderedBookings.length === 0 && <p className="panel-card">Nenhum agendamento registrado.</p>}
        {bookingToEdit ? (
          <EditBookingForm
            key={bookingToEdit.id}
            booking={bookingToEdit}
            bookings={bookings}
            onClose={() => setEditing(null)}
            onSave={() => {
              setBookings(getBookings())
              setEditing(null)
              setMessage('Agendamento atualizado.')
            }}
          />
        ) : (
        <div className="panel-grid">
          {orderedBookings.map((booking) => {
            const cancelled = isCancelled(booking)
            const titles = Array.isArray(booking.services)
              ? booking.services.map((service) => service?.title ?? service).filter(Boolean)
              : [booking.service?.title ?? booking.service].filter(Boolean)
            return (
              <article key={booking.id} className="panel-card">
                <span className="panel-tag">{cancelled ? 'Cancelado' : 'Registrado'}</span>
                <h2>{booking.name}</h2>
                <p>{booking.date?.split('-').reverse().join('/')} às {booking.time}</p>
                <p>{booking.phone}</p>
                <p>{titles.join(', ')}</p>
                {booking.total != null && <p>{formatCurrency(booking.total)}</p>}
                {booking.notes && <p>{booking.notes}</p>}
                {!cancelled && (confirmation === booking.id ? (
                  <div className="panel-confirm">
                    <p>Cancelar este agendamento?</p>
                    <button type="button" onClick={() => handleCancel(booking.id)}>Confirmar cancelamento</button>
                    <button type="button" onClick={() => setConfirmation(null)}>Manter</button>
                  </div>
                ) : (
                  <div className="panel-actions">
                    <button type="button" onClick={() => {
                      setMessage('')
                      setError('')
                      setEditing(booking.id)
                    }}>Editar</button>
                    <button type="button" onClick={() => setConfirmation(booking.id)}>Cancelar</button>
                  </div>
                ))}
              </article>
            )
          })}
        </div>
        )}
      </main>
      <Footer />
    </>
  )
}
