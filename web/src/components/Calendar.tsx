import { AnimatePresence, motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { CUPS, TEA_COLOR } from '../data/cups'
import { MONTHS, WEEKDAYS, dayKey, longDay, weekdayOf } from '../data/days'
import { CupCard } from './CupCard'
import { GlassSheet } from './GlassSheet'
import { Icon } from './Icon'
import { Smooth } from './Smooth'

const WEEKS = 6
const cupsOf = (key: string) => CUPS.filter((c) => dayKey(c.date) === key)

/** Кнопка в шапке, открывает шторку с месяцем. */
export function CalendarButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button className="round-icon" aria-label="Календарь" whileTap={{ scale: 0.88 }} onClick={onClick}>
      <Icon name="calendar" />
    </motion.button>
  )
}

/** 42 дня: шесть полных недель, чтобы календарь не менял высоту. Дни соседних месяцев тоже есть. */
function monthCells(year: number, month: number): Date[] {
  const start = new Date(year, month, 1 - weekdayOf(new Date(year, month, 1)))
  return Array.from({ length: WEEKS * 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
}

interface Props {
  open: boolean
  onClose: () => void
  /** Открыть детали чашки: календарь при этом закрывается. */
  onOpenCup: (id: number) => void
}

/** Компактная шторка с месяцем. Размер постоянный: всегда шесть рядов. Месяцы листаются со сдвигом,
 *  тап по дню показывает его чашки теми же карточками, что на главной. Высота списка под месяцем меняется плавно. */
export function MonthSheet({ open, onClose, onOpenCup }: Props) {
  const [now] = useState(() => new Date())
  const [shown, setShown] = useState({ year: now.getFullYear(), month: now.getMonth(), dir: 1 })
  const [peek, setPeek] = useState(dayKey(now))
  const today = dayKey(now)
  const dayCups = cupsOf(peek)
  const peekDate = new Date(`${peek}T12:00:00`)
  const monthKey = shown.year * 12 + shown.month

  const step = (delta: number) => {
    const d = new Date(shown.year, shown.month + delta, 1)
    setShown({ year: d.getFullYear(), month: d.getMonth(), dir: delta })
  }

  return (
    <GlassSheet open={open} label="Календарь" narrow onClose={onClose}>
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

      <div className="cal-weekdays">
        {WEEKDAYS.map((w) => (
          <small key={w}>{w}</small>
        ))}
      </div>
      <div className="cal-pane">
        <AnimatePresence mode="popLayout" initial={false} custom={shown.dir}>
          <motion.div
            key={monthKey}
            className="cal-grid"
            custom={shown.dir}
            variants={{
              enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
              show: { x: 0, opacity: 1 },
              leave: (dir: number) => ({ x: dir * -60, opacity: 0 }),
            }}
            initial="enter"
            animate="show"
            exit="leave"
            transition={{ duration: 0.32, ease: [0.3, 0.7, 0.3, 1] }}
          >
            {monthCells(shown.year, shown.month).map((d) => {
              const key = dayKey(d)
              const colors = [...new Set(cupsOf(key).map((c) => TEA_COLOR[c.type]))]
              return (
                <button key={key} className={d.getMonth() === shown.month ? 'cal-day' : 'cal-day out'} style={{ '--today': key === today ? 1 : 0 } as CSSProperties} aria-pressed={peek === key} onClick={() => setPeek(key)}>
                  <b>{d.getDate()}</b>
                  <span className="cal-dots" aria-hidden>
                    {colors.slice(0, 3).map((c) => (
                      <i key={c} style={{ background: c }} />
                    ))}
                  </span>
                </button>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <section className="agenda" aria-label={longDay(peekDate)}>
        <h3>{longDay(peekDate)}</h3>
        <Smooth>
          {dayCups.length === 0 && <p>В этот день чая не было</p>}
          <ul className="list">
            {dayCups.map((cup, i) => (
              <motion.li key={`${peek}-${cup.id}`} initial={{ opacity: 0, x: -70 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}>
                <CupCard
                  cup={cup}
                  index={i}
                  onOpen={() => {
                    onClose()
                    onOpenCup(cup.id)
                  }}
                />
              </motion.li>
            ))}
          </ul>
        </Smooth>
      </section>
    </GlassSheet>
  )
}
