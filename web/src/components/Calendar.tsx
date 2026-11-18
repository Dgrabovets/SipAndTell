import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { CUPS, TEA_COLOR } from '../data/cups'
import { MONTHS, WEEKDAYS, dayKey, longDay, weekdayOf } from '../data/days'
import { useVariants } from '../variants/useVariants'
import { GlassSheet } from './GlassSheet'
import { Icon } from './Icon'
import { Score } from './Score'

const cupsOf = (key: string) => CUPS.filter((c) => dayKey(c.date) === key)

/** Цвета чаёв, выпитых в этот день, без повторов. */
const colorsOf = (key: string) => [...new Set(cupsOf(key).map((c) => TEA_COLOR[c.type]))]

function Dots({ colors }: { colors: string[] }) {
  return (
    <span className="cal-dots" aria-hidden>
      {colors.slice(0, 3).map((c) => (
        <i key={c} style={{ background: c }} />
      ))}
    </span>
  )
}

/** Фон дня в цветах выпитых чаёв: один цвет заливкой, несколько полосами. */
function tintOf(colors: string[]): string | undefined {
  if (colors.length === 0) return undefined
  const mix = colors.map((c) => `color-mix(in srgb, ${c} 45%, transparent)`)
  return mix.length === 1 ? mix[0] : `linear-gradient(135deg, ${mix.join(', ')})`
}

/** Кнопка в шапке, открывает шторку с месяцем. */
export function CalendarButton({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <motion.button className={active ? 'round-icon cal-btn on' : 'round-icon cal-btn'} aria-label="Календарь" whileTap={{ scale: 0.88 }} onClick={onClick}>
      <Icon name="calendar" />
    </motion.button>
  )
}

interface Props {
  open: boolean
  onClose: () => void
  /** Выбранный день главного списка или null, если показаны все. */
  selected: string | null
  onSelect: (key: string | null) => void
  /** Открыть детали чашки (вариант «С чашками дня»). */
  onOpenCup: (id: number) => void
}

/** Шторка с месяцем. Вид дня выбирается в панели «Вид»: точки, заливка цветом чая или список чашек дня под месяцем. */
export function MonthSheet({ open, onClose, selected, onSelect, onOpenCup }: Props) {
  const { variants } = useVariants()
  const style = variants.month
  const [now] = useState(() => new Date())
  const [shown, setShown] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [peek, setPeek] = useState(dayKey(now))
  const first = new Date(shown.year, shown.month, 1)
  const count = new Date(shown.year, shown.month + 1, 0).getDate()
  const today = dayKey(now)
  const cells = [...Array(weekdayOf(first)).fill(null), ...Array.from({ length: count }, (_, i) => new Date(shown.year, shown.month, i + 1))]
  const dayCups = cupsOf(peek)

  const step = (delta: number) => {
    const d = new Date(shown.year, shown.month + delta, 1)
    setShown({ year: d.getFullYear(), month: d.getMonth() })
  }

  /** В режиме списка тап по дню только показывает его чашки, в остальных фильтрует главный список. */
  const pick = (key: string) => {
    if (style === 'agenda') return setPeek(key)
    onSelect(selected === key ? null : key)
    onClose()
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
      <div className="cal-grid" data-style={style}>
        {WEEKDAYS.map((w) => (
          <small key={w}>{w}</small>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`gap${i}`} />
          const key = dayKey(d)
          const colors = colorsOf(key)
          const on = style === 'agenda' ? peek === key : selected === key
          return (
            <button key={key} className="cal-day" style={{ '--today': key === today ? 1 : 0, background: !on && style === 'tint' ? tintOf(colors) : undefined } as CSSProperties} aria-pressed={on} onClick={() => pick(key)}>
              <b>{d.getDate()}</b>
              {style !== 'tint' && <Dots colors={colors} />}
            </button>
          )
        })}
      </div>

      {style === 'agenda' && (
        <section className="agenda" aria-label={longDay(new Date(`${peek}T12:00:00`))}>
          <h3>{longDay(new Date(`${peek}T12:00:00`))}</h3>
          {dayCups.length === 0 && <p>В этот день чая не было</p>}
          {dayCups.map((c) => (
            <button
              key={c.id}
              className="agenda-row"
              style={{ '--dot': TEA_COLOR[c.type] } as CSSProperties}
              onClick={() => {
                onClose()
                onOpenCup(c.id)
              }}
            >
              <span>{c.name}</span>
              <small>{c.type}</small>
              <Score value={c.score} size={36} />
            </button>
          ))}
        </section>
      )}
    </GlassSheet>
  )
}
