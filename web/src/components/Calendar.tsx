import { motion } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { CUPS, TEA_COLOR } from '../data/cups'
import { MONTHS, WEEKDAYS, dayKey, startOfDay, weekdayOf } from '../data/days'
import { GlassSheet } from './GlassSheet'
import { Icon } from './Icon'

/** Цвета чаёв, выпитых в этот день: до трёх точек под числом. */
function dotsOf(key: string): string[] {
  return [...new Set(CUPS.filter((c) => dayKey(c.date) === key).map((c) => TEA_COLOR[c.type]))].slice(0, 3)
}

function Dots({ colors }: { colors: string[] }) {
  return (
    <span className="cal-dots" aria-hidden>
      {colors.map((c) => (
        <i key={c} style={{ background: c }} />
      ))}
    </span>
  )
}

interface PickProps {
  /** Выбранный день или null, если показаны все. */
  selected: string | null
  onSelect: (key: string | null) => void
}

const STRIP_DAYS = 14

/** Лента последних двух недель: число, день недели и точки цвета чая. Тап выбирает день, второй тап снимает выбор. */
export function DayStrip({ selected, onSelect }: PickProps) {
  const box = useRef<HTMLDivElement>(null)
  const [today] = useState(() => startOfDay(new Date()))
  const days = Array.from({ length: STRIP_DAYS }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - (STRIP_DAYS - 1 - i)))

  useEffect(() => {
    if (box.current) box.current.scrollLeft = box.current.scrollWidth
  }, [])

  return (
    <div className="strip" ref={box} role="group" aria-label="Выбрать день">
      {days.map((d) => {
        const key = dayKey(d)
        const on = selected === key
        return (
          <motion.button key={key} className="strip-day" aria-pressed={on} whileTap={{ scale: 0.9 }} onClick={() => onSelect(on ? null : key)}>
            <small>{WEEKDAYS[weekdayOf(d)]}</small>
            <b>{d.getDate()}</b>
            <Dots colors={dotsOf(key)} />
          </motion.button>
        )
      })}
    </div>
  )
}

/** Кнопка в шапке, открывает шторку с месяцем. */
export function CalendarButton({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <motion.button className={active ? 'round-icon cal-btn on' : 'round-icon cal-btn'} aria-label="Календарь" whileTap={{ scale: 0.88 }} onClick={onClick}>
      <Icon name="calendar" />
    </motion.button>
  )
}

/** Шторка с месяцем: дни с чаепитиями отмечены точками, тап по дню фильтрует список. */
export function MonthSheet({ open, onClose, selected, onSelect }: PickProps & { open: boolean; onClose: () => void }) {
  const [now] = useState(() => new Date())
  const [shown, setShown] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const first = new Date(shown.year, shown.month, 1)
  const count = new Date(shown.year, shown.month + 1, 0).getDate()
  const today = dayKey(now)
  const cells = [...Array(weekdayOf(first)).fill(null), ...Array.from({ length: count }, (_, i) => new Date(shown.year, shown.month, i + 1))]

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
          return (
            <button
              key={key}
              className="cal-day"
              style={{ '--today': key === today ? 1 : 0 } as CSSProperties}
              aria-pressed={selected === key}
              onClick={() => {
                onSelect(selected === key ? null : key)
                onClose()
              }}
            >
              <b>{d.getDate()}</b>
              <Dots colors={dotsOf(key)} />
            </button>
          )
        })}
      </div>
    </GlassSheet>
  )
}
