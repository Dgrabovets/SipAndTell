import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { TEA_COLOR, type Cup } from '../data/cups'
import { useCups } from '../data/store'
import { WEEKDAYS, dayKey, weekdayOf } from '../data/days'

const WEEK_DAYS = 7
const DAY_MS = 86_400_000

const oneDecimal = (n: number) => n.toLocaleString('ru-RU', { maximumFractionDigits: 1 })

/** Последние семь дней, от старого к сегодняшнему. */
function weekDays(now: Date): Date[] {
  return Array.from({ length: WEEK_DAYS }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - (WEEK_DAYS - 1 - i)))
}

/** Сводка за последние семь дней: сколько чашек, средняя оценка, любимый тип и чашки по дням. */
function weekStats(all: Cup[], now: Date) {
  const days = weekDays(now)
  const from = +days[0]
  const cups = all.filter((c) => +c.date >= from - DAY_MS / 2)
  const average = cups.reduce((sum, c) => sum + c.score, 0) / (cups.length || 1)
  const counts = new Map<string, number>()
  for (const c of cups) counts.set(c.type, (counts.get(c.type) ?? 0) + 1)
  const favourite = [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  const byDay = days.map((d) => ({ date: d, cups: cups.filter((c) => dayKey(c.date) === dayKey(d)) }))
  return { count: cups.length, average, favourite, byDay, today: dayKey(now) }
}

type Stats = ReturnType<typeof weekStats>

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

/** Шапка главной: приветствие, сводка недели и справа место под действие. */
export function Header({ action }: { action?: ReactNode }) {
  const [now] = useState(() => new Date())
  const s = weekStats(useCups(), now)

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
      <Week s={s} />
    </>
  )
}
