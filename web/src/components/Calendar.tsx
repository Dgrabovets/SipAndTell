import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { CUPS, TEA_COLOR } from '../data/cups'
import { MONTHS, WEEKDAYS, dayKey, longDay, weekdayOf } from '../data/days'
import { CupCard } from './CupCard'
import { GlassSheet } from './GlassSheet'
import { Icon } from './Icon'
import { SwipeRow } from './SwipeRow'

const cupsOf = (key: string) => CUPS.filter((c) => dayKey(c.date) === key)

/** Кнопка в шапке, открывает шторку с месяцем. */
export function CalendarButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button className="round-icon" aria-label="Календарь" whileTap={{ scale: 0.88 }} onClick={onClick}>
      <Icon name="calendar" />
    </motion.button>
  )
}

interface Props {
  open: boolean
  onClose: () => void
  /** Открыть детали чашки: календарь при этом закрывается. */
  onOpenCup: (id: number) => void
}

/** Шторка с месяцем по центру. Под числами точки цвета выпитых чаёв, тап по дню показывает чашки этого дня теми же карточками, что на главной. */
export function MonthSheet({ open, onClose, onOpenCup }: Props) {
  const [now] = useState(() => new Date())
  const [shown, setShown] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [peek, setPeek] = useState(dayKey(now))
  const first = new Date(shown.year, shown.month, 1)
  const count = new Date(shown.year, shown.month + 1, 0).getDate()
  const today = dayKey(now)
  const cells = [...Array(weekdayOf(first)).fill(null), ...Array.from({ length: count }, (_, i) => new Date(shown.year, shown.month, i + 1))]
  const dayCups = cupsOf(peek)
  const peekDate = new Date(`${peek}T12:00:00`)

  const step = (delta: number) => {
    const d = new Date(shown.year, shown.month + delta, 1)
    setShown({ year: d.getFullYear(), month: d.getMonth() })
  }

  return (
    <GlassSheet open={open} label="Календарь" onClose={onClose}>
      <div className="cal-head">
        <button className="round-icon" aria-label="Предыдущий месяц" onClick={() => step(-1)}>
          <Icon name="back" />
        </button>
        <h2 className="sheet-title">
          {MONTHS[shown.month]} {shown.year}
        </h2>
        <button className="round-icon" aria-label="Следующий месяц" onClick={() => step(1)}>
          <Icon name="forward" />
        </button>
      </div>
      <div className="cal-grid">
        {WEEKDAYS.map((w) => (
          <small key={w}>{w}</small>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`gap${i}`} />
          const key = dayKey(d)
          const colors = [...new Set(cupsOf(key).map((c) => TEA_COLOR[c.type]))]
          return (
            <button key={key} className="cal-day" style={{ '--today': key === today ? 1 : 0 } as CSSProperties} aria-pressed={peek === key} onClick={() => setPeek(key)}>
              <b>{d.getDate()}</b>
              <span className="cal-dots" aria-hidden>
                {colors.slice(0, 3).map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
            </button>
          )
        })}
      </div>

      <section className="agenda" aria-label={longDay(peekDate)}>
        <h3>{longDay(peekDate)}</h3>
        {dayCups.length === 0 && <p>В этот день чая не было</p>}
        <ul className="list">
          {dayCups.map((cup, i) => (
            <motion.li key={`${peek}-${cup.id}`} initial={{ opacity: 0, x: -70 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}>
              <SwipeRow>
                <CupCard
                  cup={cup}
                  index={i}
                  onOpen={() => {
                    onClose()
                    onOpenCup(cup.id)
                  }}
                />
              </SwipeRow>
            </motion.li>
          ))}
        </ul>
      </section>
    </GlassSheet>
  )
}
