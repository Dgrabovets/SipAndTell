const DAY_MS = 86_400_000

export const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const MONTHS_OF = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

/** День недели с понедельника: 0 это Пн, 6 это Вс. */
export const weekdayOf = (d: Date) => (d.getDay() + 6) % 7

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

/** Ключ дня для сравнения: «2026-11-18». */
export const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const mondayOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - weekdayOf(d))

/** Заголовок группы в списке: «Сегодня», «Вчера», «На этой неделе», «На прошлой неделе», дальше название месяца. */
export function dayGroup(date: Date, now = new Date()): string {
  const days = Math.round((+startOfDay(now) - +startOfDay(date)) / DAY_MS)
  if (days <= 0) return 'Сегодня'
  if (days === 1) return 'Вчера'
  const weeks = Math.round((+mondayOf(now) - +mondayOf(date)) / (7 * DAY_MS))
  if (weeks <= 0) return 'На этой неделе'
  if (weeks === 1) return 'На прошлой неделе'
  return MONTHS[date.getMonth()]
}

/** «18 ноября». */
export const longDay = (d: Date) => `${d.getDate()} ${MONTHS_OF[d.getMonth()]}`
