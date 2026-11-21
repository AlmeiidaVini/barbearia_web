import { useState } from 'react'
import { services } from '../data/services'
import { durationToMinutes, formatCurrency, formatDuration, getAvailableSlots, getMaxBookingDate, getTodayLocalDate } from '../utils/bookingUtils'
import { updateBooking } from '../services/bookingsService'

export default function EditBookingForm({ booking, bookings, onSave, onClose }) {
  const [draft, setDraft] = useState({
    name: booking.name ?? '',
    phone: booking.phone ?? '',
    date: booking.date ?? '',
    time: booking.time ?? '',
    notes: booking.notes ?? ''
  })
  const [titles, setTitles] = useState(() => Array.isArray(booking.services)
    ? booking.services.map((service) => service?.title ?? service)
    : [booking.service?.title ?? booking.service].filter(Boolean))
  const [error, setError] = useState('')
  const selected = services.filter((service) => titles.includes(service.title))
  const total = selected.reduce((sum, service) => sum + service.priceValue, 0)
  const duration = selected.reduce((sum, service) => sum + durationToMinutes(service.duration), 0)
  const slots = getAvailableSlots(draft.date, duration, bookings.filter((item) => item.id !== booking.id))

  function handleChange(event) {
    const { name, value } = event.target
    setDraft((previous) => ({ ...previous, [name]: value, ...(name === 'date' && { time: '' }) }))
    setError('')
  }

  function toggleService(title) {
    setTitles((previous) => previous.includes(title)
      ? previous.filter((item) => item !== title)
      : [...previous, title])
    setDraft((previous) => ({ ...previous, time: '' }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const phoneDigits = draft.phone.replace(/\D/g, '')
    if (draft.name.trim().length < 2 || phoneDigits.length !== 11) {
      setError('Informe um nome válido e um telefone com DDD e 11 dígitos.')
      return
    }
    if (!slots.includes(draft.time)) {
      setError('Escolha os serviços, a data e um horário disponível.')
      return
    }

    try {
      updateBooking(booking.id, {
        ...draft,
        name: draft.name.trim(),
        notes: draft.notes.trim(),
        phoneDigits,
        services: selected.map(({ title, duration, priceValue }) => ({ title, duration, price: priceValue })),
        total,
        totalDuration: formatDuration(duration),
        totalDurationMinutes: duration
      })
    } catch (failure) {
      setError(failure.message || 'Não foi possível salvar as alterações.')
      return
    }
    onSave()
  }

  return (
    <form className="panel-card panel-edit" onSubmit={handleSubmit} noValidate>
      <h2>Editar agendamento</h2>
      <label>Nome completo<input autoFocus name="name" value={draft.name} onChange={handleChange} required /></label>
      <label>Telefone<input name="phone" type="tel" value={draft.phone} onChange={handleChange} required /></label>
      <fieldset>
        <legend>Serviços</legend>
        {services.map((service) => (
          <label key={service.title}>
            <input type="checkbox" checked={titles.includes(service.title)} onChange={() => toggleService(service.title)} />
            {service.title}
          </label>
        ))}
      </fieldset>
      <p>Total {formatCurrency(total)} {duration > 0 && `· ${formatDuration(duration)}`}</p>
      <label>Data<input type="date" name="date" min={getTodayLocalDate()} max={getMaxBookingDate()} value={draft.date} onChange={handleChange} required /></label>
      <label>Horário
        <select name="time" value={slots.includes(draft.time) ? draft.time : ''} onChange={handleChange} required>
          <option value="">{slots.length ? 'Selecione um horário' : 'Sem horários disponíveis'}</option>
          {slots.map((slot) => <option key={slot}>{slot}</option>)}
        </select>
      </label>
      <label>Observações<textarea name="notes" rows={3} value={draft.notes} onChange={handleChange} /></label>
      {error && <p role="alert" className="panel-notice">{error}</p>}
      <div className="panel-actions">
        <button type="submit">Salvar alterações</button>
        <button type="button" onClick={onClose}>Voltar à lista</button>
      </div>
    </form>
  )
}
