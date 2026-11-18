import { motion } from 'motion/react'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { CUPS, TEA_COLOR, type Cup } from '../data/cups'
import { WEEKDAYS, dayKey, weekdayOf } from '../data/days'
import { useVariants } from '../variants/useVariants'
import { CountUp } from './CountUp'

const WEEK_DAYS = 7
const DAY_MS = 86_400_000

const oneDecimal = (n: number) => n.toLocaleString('ru-RU', { maximumFractionDigits: 1 })

/** Последние семь дней, от старого к сегодняшнему. */
function weekDays(now: Date): Date[] {
  return Array.from({ length: WEEK_DAYS }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - (WEEK_DAYS - 1 - i)))
}

/** Сводка за последние семь дней: сколько чашек, средняя оценка, любимый тип и чашки по дням. */
function weekStats(now: Date) {
  const days = weekDays(now)
  const from = +days[0]
  const cups = CUPS.filter((c) => +c.date >= from - DAY_MS / 2)
  const average = cups.reduce((sum, c) => sum + c.score, 0) / (cups.length || 1)
  const counts = new Map<string, number>()
  for (const c of cups) counts.set(c.type, (counts.get(c.type) ?? 0) + 1)
  const favourite = [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  const byDay = days.map((d) => ({ date: d, cups: cups.filter((c) => dayKey(c.date) === dayKey(d)) }))
  return { count: cups.length, average, favourite, byDay, today: dayKey(now) }
}

type Stats = ReturnType<typeof weekStats>

/** Три плитки: чаепитий, средняя оценка, любимый тип. */
function Tiles({ s }: { s: Stats }) {
  return (
    <div className="stats">
      {[
        [String(s.count), 'чаепитий'],
        [oneDecimal(s.average), 'средняя оценка'],
        [s.favourite, 'любимый тип'],
      ].map(([value, label], i) => (
        <motion.div key={label} className="stat" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
          <b>{value}</b>
          <span>{label}</span>
        </motion.div>
      ))}
    </div>
  )
}

/** Одна тонкая плашка: три показателя в строке, занимает вдвое меньше места. */
function Line({ s }: { s: Stats }) {
  return (
    <motion.div className="sum-line" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <span>
        <b>{s.count}</b> чаепитий
      </span>
      <span>
        <b>{oneDecimal(s.average)}</b> средняя
      </span>
      <span>
        <b>{s.favourite}</b> любимый
      </span>
    </motion.div>
  )
}

/** Неделя столбиками: каждая чашка кубик цвета чая, сегодня подсвечен. Под столбиками итог одной строкой. */
function Week({ s }: { s: Stats }) {
  return (
    <motion.div className="sum-week" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="week-bars">
        {s.byDay.map(({ date, cups }, d) => (
          <div key={dayKey(date)} className={dayKey(date) === s.today ? 'week-col today' : 'week-col'}>
            <span className="week-stack">
              {cups.map((c: Cup, i) => (
                <motion.i key={c.id} style={{ background: TEA_COLOR[c.type] }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.25 + d * 0.06 + i * 0.05, type: 'spring', stiffness: 300, damping: 20 }} />
              ))}
            </span>
            <small>{WEEKDAYS[weekdayOf(date)]}</small>
          </div>
        ))}
      </div>
      <p>
        <b>{s.count}</b> чаепитий · средняя <b>{oneDecimal(s.average)}</b> · любимый <b>{s.favourite}</b>
      </p>
    </motion.div>
  )
}

const RING = 30
const CIRCUMFERENCE = 2 * Math.PI * RING

/** Кольцо средней оценки слева, справа число чаепитий и любимый тип. */
function Ring({ s }: { s: Stats }) {
  return (
    <motion.div className="sum-ring" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <span className="big-ring" style={{ '--size': '84px' } as CSSProperties}>
        <svg viewBox="-36 -36 72 72" aria-hidden>
          <circle className="ring-track" r={RING} />
          <motion.circle className="ring-fill" r={RING} strokeDasharray={CIRCUMFERENCE} initial={{ strokeDashoffset: CIRCUMFERENCE }} animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - s.average / 10) }} transition={{ duration: 1.2, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }} />
        </svg>
        <b>{oneDecimal(s.average)}</b>
      </span>
      <div>
        <p>
          <b>
            <CountUp to={s.count} delay={0.3} />
          </b>{' '}
          чаепитий за неделю
        </p>
        <p>
          Любимый тип <b>{s.favourite}</b>
        </p>
        <small>средняя оценка в кольце</small>
      </div>
    </motion.div>
  )
}

const SUMMARIES = { tiles: Tiles, line: Line, week: Week, ring: Ring }

/** Шапка главной: приветствие, сводка недели (вид выбирается в панели «Вид») и справа место под действие. */
export function Header({ action }: { action?: ReactNode }) {
  const { variants } = useVariants()
  const Summary = SUMMARIES[variants.summary as keyof typeof SUMMARIES]
  const [now] = useState(() => new Date())
  const s = weekStats(now)

  return (
    <>
      <div className="head-row">
        <div>
          <motion.h1 className="title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            Привет, чаёвник
          </motion.h1>
          <p className="subtitle">Твоя неделя в чае</p>
        </div>
        {action}
      </div>
      <Summary s={s} />
    </>
  )
}
