const WEEKDAY_PERIODS = [
  {
    start: '09:00',
    end: '12:00'
  },
  {
    start: '13:00',
    end: '20:00'
  }
]

const SATURDAY_PERIODS = [
  {
    start: '09:00',
    end: '12:00'
  },
  {
    start: '13:00',
    end: '18:00'
  }
]

export function sanitizeName(value) {
  return value
    .replace(/[^\p{L}\s]/gu, '')
    .replace(/\s{2,}/g, ' ')
}

export function maskPhone(value) {
  const digits = value
    .replace(/\D/g, '')
    .slice(0, 11)

  if (!digits) {
    return ''
  }

  if (digits.length <= 2) {
    return `(${digits}`
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function getPhoneDigits(value) {
  return value.replace(/\D/g, '')
}

export function durationToMinutes(duration) {
  if (!duration) {
    return 0
  }

  let total = 0

  const hourMatch = duration.match(/(\d+)\s*h/i)
  const minuteMatch = duration.match(/(\d+)\s*min/i)

  if (hourMatch) {
    total += Number(hourMatch[1]) * 60
  }

  if (minuteMatch) {
    total += Number(minuteMatch[1])
  }

  return total
}

export function formatDuration(totalMinutes) {
  if (!totalMinutes) {
    return '0 min'
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) {
    return `${minutes} min`
  }

  if (minutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${minutes}min`
}

function timeToMinutes(time) {
  if (!time) {
    return 0
  }

  const [hours, minutes] = time
    .split(':')
    .map(Number)

  return hours * 60 + minutes
}

function formatLocalDate(date) {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    date.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getTodayLocalDate() {
  return formatLocalDate(new Date())
}

export function getMaxBookingDate() {
  const date = new Date()

  date.setFullYear(
    date.getFullYear() + 1
  )

  return formatLocalDate(date)
}

export function hasValidDateFormat(dateString) {
  return /^\d{4}-\d{2}-\d{2}$/.test(
    dateString
  )
}

function isPastDate(dateString) {
  if (!dateString) {
    return false
  }

  return dateString < getTodayLocalDate()
}

export function formatDate(dateString) {
  if (!dateString) {
    return ''
  }

  return new Intl.DateTimeFormat(
    'pt-BR'
  ).format(
    new Date(
      `${dateString}T00:00:00`
    )
  )
}

export function formatCurrency(value) {
  return Number(
    value || 0
  ).toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL'
    }
  )
}

function getBookingDuration(booking) {
  if (
    Number.isFinite(
      booking.totalDurationMinutes
    )
  ) {
    return booking.totalDurationMinutes
  }

  if (booking.totalDuration) {
    return durationToMinutes(
      booking.totalDuration
    )
  }

  if (
    Array.isArray(
      booking.services
    )
  ) {
    return booking.services.reduce(
      (total, service) =>
        total +
        durationToMinutes(
          service.duration
        ),
      0
    )
  }

  if (booking.serviceDuration) {
    return durationToMinutes(
      booking.serviceDuration
    )
  }

  return 60
}

function generatePeriodSlots(
  period,
  serviceDuration
) {
  const slots = []

  const start =
    timeToMinutes(
      period.start
    )

  const end =
    timeToMinutes(
      period.end
    )

  for (
    let current = start;
    current < end;
    current += 60
  ) {
    if (
      current + serviceDuration >
      end
    ) {
      continue
    }

    const hour =
      String(
        Math.floor(current / 60)
      ).padStart(2, '0')

    const minute =
      String(
        current % 60
      ).padStart(2, '0')

    slots.push(
      `${hour}:${minute}`
    )
  }

  return slots
}

export function isCancelled(booking) {
  return booking.status === 'cancelado' || booking.status === 'cancelled'
}

function hasTimeConflict(
  startMinutes,
  durationMinutes,
  bookings,
  date
) {
  const endMinutes =
    startMinutes +
    durationMinutes

  return bookings.some(
    (booking) => {
      if (
        isCancelled(booking) || booking.date !== date
      ) {
        return false
      }

      const bookingStart =
        timeToMinutes(
          booking.time
        )

      const bookingEnd =
        bookingStart +
        getBookingDuration(
          booking
        )

      return (
        startMinutes < bookingEnd &&
        endMinutes > bookingStart
      )
    }
  )
}

export function getAvailableSlots(
  dateString,
  durationMinutes,
  bookings
) {
  if (
    !dateString ||
    durationMinutes <= 0
  ) {
    return []
  }

  if (
    !hasValidDateFormat(dateString) || dateString > getMaxBookingDate()
  ) {
    return []
  }

  if (
    isPastDate(
      dateString
    )
  ) {
    return []
  }

  const date =
    new Date(
      `${dateString}T00:00:00`
    )

  if (formatLocalDate(date) !== dateString) return []

  const weekday = date.getDay()

  if (weekday === 0) {
    return []
  }

  const periods =
    weekday === 6
      ? SATURDAY_PERIODS
      : WEEKDAY_PERIODS

  let slots =
    periods.flatMap(
      (period) =>
        generatePeriodSlots(
          period,
          durationMinutes
        )
    )

  if (
    dateString ===
    getTodayLocalDate()
  ) {
    const now = new Date()

    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes()

    slots =
      slots.filter(
        (slot) =>
          timeToMinutes(slot) >
          currentMinutes
      )
  }

  return slots.filter(
    (slot) => {
      const startMinutes =
        timeToMinutes(slot)

      return !hasTimeConflict(
        startMinutes,
        durationMinutes,
        bookings,
        dateString
      )
    }
  )
}

export function buildWhatsAppUrl(booking) {
  const BARBERSHOP_PHONE =
    '5581986540840'

  const servicesText =
    booking.services
      .map(
        (service) =>
          `- ${service.title} - ${formatCurrency(service.price)}`
      )
      .join('\n')

  const lines = [
    'Novo agendamento',
    '',
    `Cliente: ${booking.name}`,
    `Telefone: ${booking.phone}`,
    '',
    'Serviços:',
    servicesText,
    '',
    `Data: ${formatDate(booking.date)}`,
    `Horário: ${booking.time}`,
    `Duração estimada: ${booking.totalDuration}`,
    `Total a pagar: ${formatCurrency(booking.total)}`
  ]

  if (booking.notes) {
    lines.push(
      '',
      `Observações: ${booking.notes}`
    )
  }

  const message =
    lines.join('\n')

  return (
    `https://wa.me/${BARBERSHOP_PHONE}` +
    `?text=${encodeURIComponent(message)}`
  )
}
