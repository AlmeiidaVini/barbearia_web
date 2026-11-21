import { getAvailableSlots, isCancelled } from '../utils/bookingUtils.js'

const storageKey = 'agendamentos'

export function getBookings() {
  try {
    const bookings = JSON.parse(localStorage.getItem(storageKey) || '[]')
    if (!Array.isArray(bookings)) return []
    return bookings.filter((booking) => booking && typeof booking === 'object')
      .map((booking) => isCancelled(booking)
        ? { ...booking, date: booking.date ?? booking.cancelledDate, status: 'cancelado' }
        : booking)
  } catch {
    return []
  }
}

export function createBooking(data) {
  const bookings = getBookings()
  let id = Date.now()
  while (bookings.some((booking) => booking.id === id)) id += 1

  const booking = { ...data, id, createdAt: new Date().toISOString() }
  localStorage.setItem(storageKey, JSON.stringify([...bookings, booking]))
  return booking
}

function changeBooking(id, applyChanges) {
  const bookings = getBookings()
  const index = bookings.findIndex((booking) => booking.id === id)
  if (index === -1 || isCancelled(bookings[index])) {
    throw new Error('Agendamento indisponível.')
  }

  bookings[index] = { ...bookings[index], ...applyChanges(bookings.filter((_, position) => position !== index)) }
  localStorage.setItem(storageKey, JSON.stringify(bookings))
  return bookings[index]
}

export function updateBooking(id, data) {
  return changeBooking(id, (otherBookings) => {
    if (!getAvailableSlots(data.date, data.totalDurationMinutes, otherBookings).includes(data.time)) {
      throw new Error('Esse horário está indisponível. Escolha outro.')
    }
    return data
  })
}

export function cancelBooking(id) {
  return changeBooking(id, () => ({ status: 'cancelado', cancelledAt: new Date().toISOString() }))
}
